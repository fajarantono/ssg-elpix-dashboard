'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { created, getAllData, getById } from '@/services/api';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import {
  CheckIcon,
  LucideArrowLeftFromLine,
  LucideTvMinimalPlay,
  ScissorsIcon,
  ScanEye,
  Sparkles,
  SlidersHorizontal,
  Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Enhancer, MLModel } from '../_interfaces/MlData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion/Accordion';
import Switch from '@/components/form/switch/Switch';
import { cn } from '@/lib/utils';
import { UploadedVideo } from '@/app/(dashboard)/worksheet-video/_interfaces/WorksheetVideo';
import Image from 'next/image';
import Icon from '@/components/ui/icon';
import { Slider } from '@/components/ui/slider/Slider';
import { toast } from 'react-toastify';
import ErrorPage from '@/components/pages/ErrorPage';
import LoadingForm from './LoadingForm';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import VideoExample from './VideoExample';
import VideoInfo from './VideoInfo';

interface SettingValue {
  id: string;
  name: string;
  value: string | number | boolean;
  settingId: string;
  isDefault: boolean;
  isActive: boolean;
}

interface Setting {
  id: string;
  name: string;
  sequenceNo: number;
  icon: string;
  isActive: boolean;
  settingValues: SettingValue[];
}

const classifyYUVFormat = (
  bitDepth: number,
  chromaSubsampling: string,
): string => {
  const subsamplingMap: Record<string, string> = {
    '4:2:0': '420',
    '4:2:2': '422',
    '4:4:4': '444',
  };
  const subsampling = subsamplingMap[chromaSubsampling];

  if (!subsampling) return '';
  if (bitDepth === 8) return `yuv${subsampling}p`;
  if (bitDepth === 10) return `yuv${subsampling}p10le`;

  return '';
};

type Quality = 'very high' | 'high' | 'medium';

const getEncodingQuality = (
  quality: Quality,
): {
  crf: { min: number; max: number };
  qscale: { min: number; max: number };
} => {
  switch (quality) {
    case 'very high':
      return { crf: { min: 0, max: 20 }, qscale: { min: 0, max: 9 } };
    case 'high':
      return { crf: { min: 21, max: 25 }, qscale: { min: 10, max: 11 } };
    case 'medium':
      return { crf: { min: 26, max: 51 }, qscale: { min: 12, max: 32 } };
    default:
      throw new Error('Invalid quality');
  }
};

const getValueEncodingQuality = (
  quality: Quality,
): {
  crf: number;
  qscale: number;
} => {
  const ranges = getEncodingQuality(quality);
  return {
    crf: Math.round((ranges.crf.min + ranges.crf.max) / 2),
    qscale: Math.round((ranges.qscale.min + ranges.qscale.max) / 2),
  };
};

const getSelected = (data: Record<string, MLModel | null>): number[] => {
  return Object.values(data)
    .filter((item) => item !== null)
    .map((item) => Number(item.id));
};

export const EnhanceVideo: React.FunctionComponent<{
  id: string;
}> = ({ id }) => {
  const [data, setData] = useState<UploadedVideo | null>(null);
  const [mlFeatures, setMlFeatures] = useState<Enhancer[]>([]);
  const [mlSettings, setMlSettings] = useState<Setting[]>([]);
  const [credit, setCredit] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingIcon, setIsLoadingIcon] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rangeValue, setRangeValue] = useState<[number, number]>([0, 100]);
  const [previewEnabled, setPreviewEnabled] = useState(false);

  const [selectedModels, setSelectedModels] = useState<
    Record<string, MLModel | null>
  >({});
  const [selectedSettings, setSelectedSettings] = useState<
    Record<string, SettingValue>
  >({});

  const ability = useAbility();
  const router = useRouter();

  const getDataVideo = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getById(`/api/v1/video`, id);

      setData(res.data ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const getCredit = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getAllData(`/api/v1/tensorpix/credits`);

      setCredit(res.data ? res.data.balanceUsd : '');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMlModels = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getAllData(`/api/v1/tensorpix/ml-models`);

      setMlFeatures(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSettingModels = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getAllData(`/api/v1/tensorpix/settings`);

      const data = Array.isArray(res.data) ? res.data : [];

      for (const setting of data) {
        for (const value of setting.settingValues) {
          if (value.isDefault) handleSelect(setting.id, value);
        }
      }

      setMlSettings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectModel = (id: string, model: MLModel) => {
    setSelectedModels((prev) => {
      const current = prev[id];

      return {
        ...prev,
        [id]: current === model ? null : model,
      };
    });
  };

  const handleSelect = (id: string, setting: SettingValue) => {
    setSelectedSettings((prev) => ({
      ...prev,
      [id]: setting,
    }));
  };

  const handleEnhance = useCallback(async () => {
    setIsLoadingIcon(true);
    try {
      if (data) {
        const starFrame = Math.floor((rangeValue[0] / 100) * data.nFrames);
        const endFrame = Math.floor((rangeValue[1] / 100) * data.nFrames);
        const { crf, qscale } = getValueEncodingQuality(
          selectedSettings['67ff3b2a5d7aa9e27670e42a'].value as Quality,
        );
        const chromaSubsampling = classifyYUVFormat(
          data.bitDepth,
          data.chromaSubsampling,
        );
        const mlModels = getSelected(selectedModels);

        const payload: Record<
          string,
          string | number | boolean | string[] | number[] | null
        > = {
          codec: selectedSettings['67ff3b3c7000bf81e999f5d9'].value,
          crf: crf,
          qscale: qscale,
          container: selectedSettings['67ff3b35b5cbc84cf90b8bb6'].value,
          chroma_subsampling: chromaSubsampling,
          preview: previewEnabled,
          start_frame: starFrame,
          end_frame: endFrame,
          input_video: data.id,
          output_video: null,
          ml_models: mlModels,
          output_resolution: selectedSettings['67ff374690d8fc7f59e178ad'].value,
          grain: selectedSettings['67ff3b3073e8359703e193a0'].value,
          comparison: selectedSettings['680187ab48186ee7799a92f4'].value,
          stabilization_smoothing: 40, // ml_models id 26 on else off
          prores_profile: -1,
        };

        const response = await created('/api/v1/enhance', payload);
        toast.success(`${response.message}`, {
          position: 'top-right',
          autoClose: 5000,
          theme: 'colored',
        });

        router.replace(`/enhance/process/${response.data.id}`);
      }
    } catch (err) {
      setIsLoadingIcon(false);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      toast.error(`${err}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    } finally {
      setIsLoadingIcon(false);
    }
  }, [
    data,
    previewEnabled,
    rangeValue,
    router,
    selectedModels,
    selectedSettings,
  ]);

  useEffect(() => {
    getDataVideo();
    getCredit();
    getMlModels();
    getSettingModels();
  }, [getDataVideo, getCredit, getMlModels, getSettingModels]);

  return (
    <React.Fragment>
      <Button
        onClick={router.back}
        startIcon={<LucideArrowLeftFromLine size={15} />}
        size="xs"
        variant="outline"
        className={cn(
          'text-md text-gray-500 p-2 dark:text-gray-300 rounded-xl border-1 mb-0',
        )}
      >
        <span>Uploaded Video</span>
      </Button>

      {ability.can('read', 'Worksheet') && (
        <React.Fragment>
          {error && <ErrorPage />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Left Column */}
            <div className="flex flex-col flex-1 min-h-[80vh]">
              <div className="sticky top-22 z-1 space-y-5">
                {/* card video */}
                <ComponentCard>
                  <div className="flex items-center gap-x-2 mb-3">
                    <LucideTvMinimalPlay className="text-gray-700 dark:text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      Info Video
                    </h3>
                  </div>
                  {isLoading ? <LoadingForm /> : <VideoInfo data={data} />}
                </ComponentCard>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col min-h-[80vh] space-y-5">
              {/* ML Models */}
              <ComponentCard>
                <Accordion type="multiple" defaultValue={['item-1']}>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-outfit font-semibold dark:text-white pt-0 flex flex-row">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal />
                        <span>Select AI Filter</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 border-t-2 pt-5 dark:border-gray-700">
                        {mlFeatures.map((feature) => (
                          <div
                            key={feature.id}
                            className="border-t pt-4 first:border-none first:pt-0 dark:border-gray-700"
                          >
                            <div className="flex flex-wrap items-start sm:flex-nowrap gap-4 sm:gap-12 justify-center">
                              <h3 className="flex w-full max-w-[220px] text-nowrap items-center justify-center sm:justify-between gap-4">
                                <div className="hover:cursor-pointer">
                                  <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-start gap-2 text-base font-medium text-black dark:text-gray-100">
                                          <Icon
                                            name={feature.icon}
                                            size={40}
                                            className="w-6 h-6 text-gray-600 dark:text-gray-300 me-2"
                                          />
                                          <div className="flex items-center gap-1">
                                            <span>{feature.name}</span>
                                            <Icon
                                              name="CircleHelp"
                                              size={14}
                                              className="opacity-60"
                                            />
                                          </div>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipPortal>
                                        <TooltipContent
                                          side="top"
                                          sideOffset={8}
                                          className="relative z-50 w-[500px] rounded-lg border bg-white p-4 shadow-xl dark:bg-gray-800 dark:border-gray-700"
                                        >
                                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {feature.name}
                                          </h4>
                                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                            {feature.description}
                                          </p>
                                          <div>
                                            <VideoExample
                                              videoUrl={feature.videoUrl}
                                            />
                                          </div>
                                          <TooltipArrow className="fill-white dark:fill-gray-800" />
                                        </TooltipContent>
                                      </TooltipPortal>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </h3>

                              <div className="w-full">
                                <div className="items-center text-xs md:text-sm">
                                  <div className="flex gap-1 sm:gap-2 flex-wrap justify-center sm:justify-start">
                                    {feature.mlModels.map((model) => {
                                      const isSelected =
                                        selectedModels[feature.id] === model;
                                      return (
                                        <button
                                          key={model.id}
                                          onClick={() =>
                                            !feature.isDisable &&
                                            handleSelectModel(
                                              feature.id.toString(),
                                              model,
                                            )
                                          }
                                          disabled={feature.isDisable}
                                          className={`px-6 py-2 border border-primary rounded-xl text-md border-blue-400 transition-colors text-center text-sm
                                            ${
                                              isSelected
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
                                            }
                                            ${feature.isDisable ? 'opacity-50 cursor-not-allowed' : ''}
                                          `}
                                        >
                                          <div className="flex flex-row">
                                            {model.name}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Show warning once per feature */}
                                  {feature.isDisable && (
                                    <span className="block mt-2 text-xs text-red-500">
                                      Please contact administrator to select
                                      this filter
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ComponentCard>
              {/* Setting */}
              <ComponentCard>
                <Accordion type="multiple">
                  <AccordionItem value="setting">
                    <AccordionTrigger className="text-lg font-outfit font-semibold dark:text-white pt-0">
                      <div className="flex items-center gap-2">
                        <Settings />
                        <span>Setting</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 border-t-2 pt-5 dark:border-gray-700">
                        {mlSettings.map((setting) => (
                          <div
                            key={setting.id}
                            className="border-t pt-4 first:border-none first:pt-0 dark:border-gray-700"
                          >
                            <div className="flex flex-wrap items-start gap-2 py-1">
                              <div className="flex items-center gap-2 w-[270px] text-lg font-medium dark:text-gray-100">
                                <Icon
                                  name={setting.icon}
                                  size={40}
                                  className="w-6 h-6 text-gray-600 dark:text-gray-300 me-2"
                                />
                                {setting.name}
                              </div>
                              <div className="flex flex-wrap gap-2 flex-1">
                                {setting.settingValues.map((value) => {
                                  const isSelected =
                                    selectedSettings[setting.id] === value;

                                  return (
                                    <button
                                      key={value.id}
                                      onClick={() =>
                                        handleSelect(setting.id, value)
                                      }
                                      className={`px-3 py-1 rounded-full text-md border transition-colors
                                      ${
                                        isSelected
                                          ? 'bg-blue-600 text-white border-blue-600'
                                          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
                                      }
                                    `}
                                    >
                                      <div className="flex flex-row">
                                        {isSelected && (
                                          <CheckIcon className="w-4 h-4 me-2 mt-0.5" />
                                        )}
                                        {value.name}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ComponentCard>
            </div>
          </div>

          <div className="w-full bottom-3">
            <ComponentCard>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex flex-row">
                <ScissorsIcon className="me-2" />
                Enhance specific segment
              </h3>
              <Slider value={rangeValue} onChange={setRangeValue} />
            </ComponentCard>
          </div>

          <div className="w-full sticky bottom-3 pb-1.5 z-10">
            <div>
              <div
                className={cn(
                  'bg-gray-100 dark:bg-gray-800',
                  'border border-gray-300 dark:border-gray-600',
                  'text-xs lg:text-sm gap-2.5 md:gap-4 py-2 md:py-2 px-6',
                  'text-gray-800 dark:text-white',
                  'rounded-2xl flex justify-center lg:justify-between items-center flex-wrap',
                )}
              >
                <div className="flex-grow flex justify-between flex-wrap items-center text-sm gap-x-5 gap-y-1.5">
                  <div className="flex items-center grow order-2">
                    <ScanEye className="mr-1.5" />
                    <span className="me-2">Preview</span>
                    <div>
                      <Switch
                        defaultChecked={previewEnabled}
                        onChange={(checked) => setPreviewEnabled(checked)}
                      />
                    </div>
                  </div>
                  <div className="items-center flex gap-3 order-2">
                    <div className="flex items-center gap-1">
                      <div>{credit}</div>
                      <Image
                        src="/images/icons/coin.svg"
                        alt="Coin"
                        width={16}
                        height={16}
                      />
                      <span> Credits </span>
                    </div>
                  </div>
                </div>
                <Button
                  size="md"
                  tooltip="Enhance"
                  className="text-md text-gray-500 dark:text-gray-300 rounded-xl"
                  variant="primary"
                  startIcon={
                    <Sparkles size="20" className="dark:text-gray-200" />
                  }
                  onClick={handleEnhance}
                  disabled={
                    !(getSelected(selectedModels).length > 0 && isLoadingIcon)
                  }
                >
                  <div>
                    {getSelected(selectedModels).length > 0 && isLoadingIcon
                      ? 'Enhance'
                      : 'Select at least 1 filter'}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
