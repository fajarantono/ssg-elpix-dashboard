'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { User } from '../_interfaces/WorksheetVideo';
import { ColumnProps } from '@/types/common';
import { deleted, getAllData } from '@/services/api';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import TableSkeleton from '@/components/tables/TableSkeleton';
import ErrorPage from '@/components/pages/ErrorPage';
import SearchInput from '@/components/tables/SearchInput';
import BasicTable from '@/components/tables/BasicTable';
import Pagination from '@/components/tables/Pagination';
import Badge from '@/components/ui/badge/Badge';
import PromptConfirm from '@/components/common/PromptConfirm';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import AvatarText from '@/components/ui/avatar/AvatarText';
import { toast } from 'react-toastify';
import Image from 'next/image';
import AddForm from './AddForm';
import EditForm from './EditForm';

export default function VideoList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [data, setData] = useState<User[]>([]);
  const [editData, setEditData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const ability = useAbility();

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleDelete = () => {
    deleted('/api/v1/user', userId)
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
    setAddModalOpen(false);
    setEditModalOpen(false);
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

  const ListColumn: ColumnProps<User>[] = [
    {
      key: 'fullname',
      title: 'No',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            {row.avatarFile ? (
              <Image
                width={40}
                height={40}
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/avatar/${row.avatarFile}`}
                alt={row.fullname ?? ''}
              />
            ) : (
              <AvatarText name={row.fullname ?? ''} />
            )}
          </div>
          <div>
            <span className="block font-medium text-gray-600 text-theme-sm dark:text-white/90">
              {row.fullname}
            </span>
            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'username',
      title: 'Format',
      render: (row) => (
        <span className="font-normal text-gray-800 dark:text-gray-400">
          {row.username}
        </span>
      ),
    },
    {
      key: 'phone',
      title: 'Format',
      render: (row) => (
        <span className="font-normal text-gray-600 dark:text-gray-400">
          {row.phone}
        </span>
      ),
    },
    {
      key: 'role',
      title: 'Size',
      render: (row) => (
        <span className="font-normal text-gray-600 dark:text-gray-400">
          {row.role}
        </span>
      ),
    },
    {
      key: 'isActive',
      title: 'Duration',
      align: 'center',
      inlineSize: 100,
      render: (row) => (
        <Badge size="sm" color={row.isActive ? 'success' : 'error'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'id',
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
              onClick={() => {}}
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
          {ability.can('update', 'User') && (
            <Button
              size="xs"
              tooltip="Edit"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 text-sm"
              variant="none"
              startIcon={<PencilIcon size="20" />}
              onClick={() => {
                setEditData(row);
                setEditModalOpen(true);
              }}
            />
          )}

          {ability.can('delete', 'User') && (
            <Button
              size="xs"
              tooltip="Delete"
              className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 text-sm"
              variant="none"
              startIcon={<Trash2Icon size="20" />}
              onClick={() => {
                setUserId(row.id ?? '');
                setUserName(row.fullname ?? '');
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
              <div>
                {ability.can('create', 'User') && (
                  <Button
                    size="sm"
                    onClick={handleAdd}
                    className="flex items-center"
                    startIcon={<PlusIcon />}
                  >
                    Add Data
                  </Button>
                )}
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

      <AddForm
        title="Add User"
        isOpen={addModalOpen}
        onClose={handleClose}
        refresh={fetchData}
      />
      <EditForm
        title="Edit User"
        initValues={editData as User}
        isOpen={editModalOpen}
        onClose={handleClose}
        refresh={fetchData}
      />
      <PromptConfirm
        title={'Delete User'}
        description={`Are you sure you want to delete this ${userName}?`}
        isOpen={deleteModalOpen}
        onClose={handleClose}
        onAccept={handleDelete}
      />
    </>
  );
}
