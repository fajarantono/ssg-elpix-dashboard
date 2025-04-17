'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { ColumnProps } from '@/types/common';
import { deleted, getAllData } from '@/services/api';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import TableSkeleton from '@/components/tables/TableSkeleton';
import ErrorPage from '@/components/pages/ErrorPage';
import SearchInput from '@/components/tables/SearchInput';
import BasicTable from '@/components/tables/BasicTable';
import Pagination from '@/components/tables/Pagination';
import PromptConfirm from '@/components/common/PromptConfirm';
import { HardDriveDownloadIcon, Trash2Icon } from 'lucide-react';
import AvatarText from '@/components/ui/avatar/AvatarText';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { DownloadVideo } from '../_interfaces/DownloadVideo';
import moment from 'moment-timezone';
import { duration, getVideoQuality, size } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

export default function ListData() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [data, setData] = useState<DownloadVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [videoId, setVideoId] = useState<number | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const ability = useAbility();

  const handleDelete = () => {
    if (videoId !== null) {
      deleted('/api/v1/download', videoId)
        .then((res) => {
          if (res) {
            toast.success(`${res.message}`, {
              position: 'top-right',
              autoClose: 5000,
              theme: 'colored',
            });
            setDeleteModalOpen(false);
            fetchData();
          }
        })
        .catch((err) => {
          toast.error(`${err}`, {
            position: 'top-right',
            autoClose: 5000,
            theme: 'colored',
          });
        });
    }
  };

  const handleClose = () => {
    setDeleteModalOpen(false);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getAllData(
        `/api/v1/enhance/video?page=${page}&limit=${limit}&sort=DESC&search=${searchTerm}`,
      );

      setData(Array.isArray(res.data) ? res.data : []);
      setTotalPage(res?.pagination?.totalPages ?? 0);
      setTotal(res?.pagination?.totalItems ?? 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [page, limit, fetchData, searchTerm]);

  const ListColumn: ColumnProps<DownloadVideo>[] = [
    {
      key: 'thumbnail',
      title: 'Thumbnail',
      render: (row) => (
        <div className="w-15 h-15 overflow-hidden rounded-md">
          {row.thumbnail ? (
            <Image
              width={60}
              height={60}
              src={row.thumbnail}
              alt={row.name ?? ''}
            />
          ) : (
            <AvatarText name={row.name ?? ''} />
          )}
        </div>
      ),
    },
    {
      key: 'previewVideos',
      title: 'Name',
      render: (row) => (
        <>
          <span className="block font-medium text-gray-600 text-theme-sm dark:text-white/90">
            {row.name}
          </span>
          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
            {row.owner ?? ''}
          </span>
        </>
      ),
    },
    {
      key: 'createdAt',
      title: 'Date',
      render: (row) => (
        <span className="font-normal text-gray-800 dark:text-gray-400">
          {moment(row.createdAt)
            .tz('Asia/Jakarta')
            .format('DD MM yyyy, hh.mm z')}
        </span>
      ),
    },
    {
      key: 'name',
      title: 'Format',
      render: (row) => (
        <span className="font-normal text-gray-600 dark:text-gray-400">
          {row.name.split('.')[1]}
        </span>
      ),
    },
    {
      key: 'framerate',
      title: 'Framerate',
      render: (row) => (
        <span className="font-normal text-gray-600 dark:text-gray-400">
          {row.framerate} FPS
        </span>
      ),
    },
    {
      key: 'nFrames',
      title: 'Duration',
      render: (row) => (
        <span className="font-normal text-gray-600 dark:text-gray-400">
          {duration(row.nFrames / row.framerate)}
        </span>
      ),
    },
    {
      key: 'width',
      title: 'Quality',
      render: (row) => (
        <span className="font-normal text-gray-600 dark:text-gray-400">
          {getVideoQuality({
            width: row.width,
            height: row.height,
            bitrate: row.bitrate,
          })}
        </span>
      ),
    },
    {
      key: 'size',
      title: 'Size',
      render: (row) => (
        <span className="font-normal text-gray-600 dark:text-gray-400">
          {size(row.size)}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      inlineSize: 200,
      render: (row) => (
        <div className="flex justify-center items-center w-full gap-2">
          {ability.can('delete', 'Video Enhance') && (
            <Button
              size="xs"
              tooltip="Delete"
              className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 text-sm"
              variant="none"
              startIcon={<Trash2Icon size="20" />}
              onClick={() => {
                setVideoId(Number(row.id));
                setVideoName(row.name ?? '');
                setDeleteModalOpen(true);
              }}
            />
          )}
          {ability.can('download', 'Video Enhance') && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={row.file}
                    download
                    className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <HardDriveDownloadIcon size="20" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top" className="relative">
                  <div className="drop-shadow-lg whitespace-nowrap rounded-lg bg-[#1E2634] px-3 py-2 text-xs font-medium text-white">
                    Download
                  </div>
                  <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#1E2634]"></div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <ComponentCard>
        <div className="space-y-4">
          {!error && (
            <div className="flex items-center justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <SearchInput
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(value) => {
                    setSearchTerm(value);
                    if (value.length >= 3) {
                      fetchData();
                    }
                  }}
                />
              </div>
            </div>
          )}
          {isLoading && <TableSkeleton columns={5} rows={10} />}
          {error && <ErrorPage />}
          {!isLoading && !error && (
            <>
              <BasicTable
                columns={ListColumn}
                data={data}
                variant={{
                  striped: true,
                  sm: true,
                  hover: true,
                }}
              />
              {data.length > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPage}
                  total={total}
                  pageSize={limit}
                  pageSizeOptions={[10, 20, 50, 100]}
                  onPageChange={(page) => {
                    setIsLoading(true);
                    setPage(page);
                  }}
                  onShowSizeChange={setLimit}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                />
              )}
            </>
          )}
        </div>
      </ComponentCard>

      <PromptConfirm
        title={'Delete User'}
        description={`Are you sure you want to delete this ${videoName}?`}
        isOpen={deleteModalOpen}
        onClose={handleClose}
        onAccept={handleDelete}
      />
    </>
  );
}
