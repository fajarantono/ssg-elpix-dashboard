'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAbility } from '@/context/AbilityContext';
import {  UploadedVideo } from '../_interfaces/WorksheetVideo';
import { ColumnProps } from '@/types/common';
import { deleted, getAllData, uploadFile } from '@/services/api';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import TableSkeleton from '@/components/tables/TableSkeleton';
import ErrorPage from '@/components/pages/ErrorPage';
import SearchInput from '@/components/tables/SearchInput';
import BasicTable from '@/components/tables/BasicTable';
import Pagination from '@/components/tables/Pagination';
import PromptConfirm from '@/components/common/PromptConfirm';
import { FolderInputIcon, Trash2Icon } from 'lucide-react';
import AvatarText from '@/components/ui/avatar/AvatarText';
import { toast } from 'react-toastify';
import Image from 'next/image';
import moment from 'moment-timezone';
import UploadModal from './UploadModal';
import Input from '@/components/form/input/InputField';
import { useRouter } from 'next/navigation';
import { duration, getVideoQuality, size } from '@/lib/utils';
import EnhanceProcess from './EnhanceProcess';

export default function VideoList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [data, setData] = useState<UploadedVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [videoId, setVideoId] = useState<string>('');
  const [videoName, setVideoName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ability = useAbility();
  const router = useRouter();

  const handleDelete = () => {
    deleted('/api/v1/video', videoId)
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
  };

  const handleClose = () => {
    setDeleteModalOpen(false);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getAllData(
        `/api/v1/video?page=${page}&limit=${limit}&sort=DESC&search=${searchTerm}`,
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

  const handleUpload = async (selected: File) => {
    setFile(selected);
    setShowModal(true);

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', selected);

    try {
      const [id, message] = await uploadFile(xhr, '/api/v1/video', formData);

      toast.success(message, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
      router.push(`/enhance/${id}`);
      fetchData();
    } catch (error) {
      setShowModal(false);
      toast.error(`Upload gagal: ${error}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    } finally {
      setTimeout(() => {
        setShowModal(false);
      }, 800);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleUpload(selected);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleUpload(dropped);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const ListColumn: ColumnProps<UploadedVideo>[] = [
    {
      key: 'name',
      title: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            {row.thumbnail ? (
              <Image
                width={40}
                height={40}
                className="rounded"
                src={row.thumbnail}
                alt={row.name ?? ''}
              />
            ) : (
              <AvatarText name={row.name ?? ''} />
            )}
          </div>
          <div>
            <span className="block font-medium text-gray-600 text-theme-sm dark:text-white/90">
              {row.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      title: 'Uploaded At',
      render: (row) => (
        <span className="font-normal text-gray-800 dark:text-gray-400">
          {moment(row.createdAt)
            .tz('Asia/Jakarta')
            .format('DD MMMM YYYY HH:mm:ss')}
        </span>
      ),
    },
    {
      key: 'id',
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
      key: 'enhance',
      title: 'Enhance',
      align: 'center',
      inlineSize: 200,
      render: (row) => (
        <div className="flex justify-center items-center w-full gap-2">
          {ability.can('create', 'Worksheet') && (
            <Button
              size="sm"
              className="text-gray-500 dark:text-gray-400 dark:hover:text-white/90 text-sm"
              variant="primary"
              onClick={() => router.push(`/enhance/${row.id}`)}
            >
              Enhance
            </Button>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      inlineSize: 200,
      render: (row) => (
        <div className="flex justify-center items-center w-full gap-2">
          {ability.can('delete', 'Worksheet') && (
            <Button
              size="xs"
              tooltip="Delete"
              className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 text-sm"
              variant="none"
              startIcon={<Trash2Icon size="20" />}
              onClick={() => {
                setVideoId(row.id ? row.id.toString() : '');
                setVideoName(row.name ?? '');
                setDeleteModalOpen(true);
              }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {ability.can('create', 'Worksheet') && (
        <div>
          <ComponentCard>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Upload Video
            </h3>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-[#7aa6ff] rounded-xl px-10 pt-16 pb-10 flex flex-col items-center justify-center text-center bg-white"
            >
              <label htmlFor="video-upload" className="cursor-pointer">
                <div className="bg-gray-200 mb-4 p-3 rounded-2xl hover:scale-120 transition-all">
                  <FolderInputIcon
                    size={40}
                    className="text-gray-400 hover:text-blue-500 hover:scale-100 transition-all"
                    onClick={() => handleFileChange}
                  />
                </div>
              </label>

              <label htmlFor="video-upload" className="cursor-pointer">
                <div className="text-gray-500 text-sm">
                  Drag and drop or{' '}
                  <label className="text-blue-500 cursor-pointer text-bold font-bold">
                    Browse
                    <Input
                      id="video-upload"
                      ref={inputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Support all image format
                </p>

                <p className="text-xs text-gray-300 mt-5">
                  Your images are safely stored and secured using military grade
                  encryption
                </p>
              </label>
            </div>
          </ComponentCard>

          <UploadModal isOpen={showModal} filename={file?.name} />
          <EnhanceProcess />
        </div>
      )}
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
            <div>
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
            </div>
          )}
        </div>
      </ComponentCard>

      <PromptConfirm
        title={'Delete Uploaded Video'}
        description={`Are you sure you want to delete this ${videoName}?`}
        isOpen={deleteModalOpen}
        onClose={handleClose}
        onAccept={handleDelete}
      />
    </>
  );
}
