'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { created, getAllData, getById } from '@/services/api';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import {
  CheckIcon,
  ClockIcon,
  FilmIcon,
  LucideArrowLeftFromLine,
  LucideTvMinimalPlay,
  ScanIcon,
  ScissorsIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MLModel } from '../_interfaces/MlData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion/Accordion';
import { duration, getVideoQuality } from '@/lib/utils';
import { UploadedVideo } from '@/app/(dashboard)/worksheet-video/_interfaces/WorksheetVideo';
import Image from 'next/image';
import AvatarText from '@/components/ui/avatar/AvatarText';
import Icon from '@/components/ui/icon';
import { Slider } from '@/components/ui/slider/Slider';
import { toast } from 'react-toastify';
import ErrorPage from '@/components/pages/ErrorPage';
import LoadingForm from './LoadingForm';

type Feature = {
  id: string;
  name: string;
  icon: string;
  mlModels: MLModel[];
};

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
  const [mlFeatures, setMlFeatures] = useState<Feature[]>([]);
  const [mlSettings, setMlSettings] = useState<Setting[]>([]);
  const [credit, setCredit] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingIcon, setIsLoadingIcon] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rangeValue, setRangeValue] = useState<[number, number]>([0, 100]);

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
          preview: true,
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
  }, [data, rangeValue, router, selectedModels, selectedSettings]);

  useEffect(() => {
    getDataVideo();
    getCredit();
    getMlModels();
    getSettingModels();
  }, [getDataVideo, getCredit, getMlModels, getSettingModels]);

  return (
    <>
      {ability.can('read', 'Worksheet') && (
        <div className="flex flex-row space-x-5">
          <div className="flex flex-col flex-1 space-y-5">
            <ComponentCard className="w-full">
              <Button
                onClick={router.back}
                startIcon={<LucideArrowLeftFromLine size={30} />}
                size="xs"
                variant="none"
              >
                <h3 className="text-lg font-semibold hover:text-gray-800 hover:dark:text-white/90">
                  Uploaded Video
                </h3>
              </Button>

              {isLoading ? (
                <LoadingForm />
              ) : (
                <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-xl flex gap-4">
                  <div className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-lg overflow-hidden">
                    {data?.thumbnail ? (
                      <Image
                        width={480}
                        height={200}
                        src={data?.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarText name={data?.name ?? ''} />
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="text-lg font-semibold text-gray-800 truncate mb-1 overflow-ellipsis">
                      {data?.name}
                    </div>

                    <div className="text-blue-500 font-medium text-sm mb-3">
                      Upload Complete
                    </div>

                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          {duration(
                            (data?.nFrames ?? 0) / (data?.framerate ?? 0),
                          )}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <FilmIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{data?.framerate} FPS</span>
                      </div>

                      <div className="flex items-center">
                        <ScanIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          {data?.width}x{data?.height}&nbsp;
                          {getVideoQuality({
                            width: data?.width ?? 1,
                            height: data?.height ?? 1,
                            bitrate: data?.bitrate,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ComponentCard>
            <ComponentCard>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex flex-row">
                <ScissorsIcon className="me-2" />
                Enhance specific segment
              </h3>
              <Slider value={rangeValue} onChange={setRangeValue} />
            </ComponentCard>
            <ComponentCard>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Credits
              </h3>
              <h5 className="text-md font-normal text-blue-500 dark:text-white/90">
                {credit}
              </h5>
            </ComponentCard>
            <ComponentCard>
              <Button
                size="sm"
                tooltip="Enhance"
                className="text-gray-500 w-full dark:text-gray-400 text-lg"
                variant="primary"
                startIcon={<LucideTvMinimalPlay size="20" />}
                onClick={handleEnhance}
                disabled={
                  !(getSelected(selectedModels).length > 0 && isLoadingIcon)
                }
              >
                <h3 className="text-lg font-semibold text-white dark:text-black/90">
                  Create
                </h3>
              </Button>
            </ComponentCard>
            {error && <ErrorPage />}
          </div>

          <div className="w-full flex-1">
            <ComponentCard>
              <Accordion type="multiple" defaultValue={['item-1']}>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-outfit font-semibold">
                    Select AI Filter
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 border-t-2 pt-5">
                      {mlFeatures.map((feature) => (
                        <div
                          key={feature.id}
                          className="border-t pt-4 first:border-none first:pt-0"
                        >
                          <div className="flex flex-wrap items-start gap-2 py-1">
                            <div className="flex items-center gap-2 w-[170px] text-lg font-medium">
                              <Icon
                                name={feature.icon}
                                size={40}
                                className="w-6 h-6 text-gray-600 me-2"
                              />
                              {feature.name}
                            </div>
                            <div className="flex flex-wrap gap-2 flex-1">
                              {feature.mlModels.map((model) => {
                                const isSelected =
                                  selectedModels[feature.id] === model;

                                return (
                                  <button
                                    key={model.id}
                                    onClick={() =>
                                      handleSelectModel(feature.id, model)
                                    }
                                    className={`px-3 py-1 rounded-full text-md border transition-colors
                                    ${
                                      isSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                                    }
                                  `}
                                  >
                                    <div className="flex flex-row">
                                      {isSelected && (
                                        <CheckIcon className="w-4 h-4 me-2 mt-0.5" />
                                      )}
                                      {model.name}
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
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-outfit font-semibold">
                    Setting
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 border-t-2 pt-5">
                      {mlSettings.map((setting) => (
                        <div
                          key={setting.id}
                          className="border-t pt-4 first:border-none first:pt-0"
                        >
                          <div className="flex flex-wrap items-start gap-2 py-1">
                            <div className="flex items-center gap-2 w-[170px] text-lg font-medium">
                              <Icon
                                name={setting.icon}
                                size={40}
                                className="w-6 h-6 text-gray-600 me-2"
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
                                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
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
      )}
    </>
  );
};
