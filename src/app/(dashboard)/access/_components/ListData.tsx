'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { Access } from '../_interfaces/Access';
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
import { toast } from 'react-toastify';
import AddForm from './AddForm';
import EditForm from './EditForm';

export default function ListData() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const [data, setData] = useState<Access[]>([]);
  const [editData, setEditData] = useState<Access | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [accessId, setAccessId] = useState<string>('');
  const [accessName, setAccessName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const ability = useAbility();

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleDelete = () => {
    deleted('/api/v1/access', accessId)
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
        `/api/v1/access?page=${page}&limit=${limit}&sort=DESC&search=${searchTerm}`,
      );

      setData(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res?.pagination?.totalPages ?? 0);
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

  const ListColumn: ColumnProps<Access>[] = [
    {
      key: 'name',
      title: 'Name',
      render: (row) => <span className="truncate font-medium">{row.name}</span>,
    },
    {
      key: 'description',
      title: 'Description',
      render: (row) => (
        <span className="max-w-[500px] truncate font-normal text-gray-600">
          {row.description}
        </span>
      ),
    },
    {
      key: 'isActive',
      title: 'Status',
      align: 'center',
      inlineSize: 100,
      render: (row) => (
        <Badge size="sm" color={row.isActive ? 'success' : 'error'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      inlineSize: 200,
      render: (row) => (
        <div className="flex justify-center items-center w-full gap-2">
          {ability.can('update', 'Access') && (
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

          {ability.can('delete', 'Role') && (
            <Button
              size="xs"
              tooltip="Delete"
              className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 text-sm"
              variant="none"
              startIcon={<Trash2Icon size="20" />}
              onClick={() => {
                setAccessId(row.id ?? '');
                setAccessName(row.name);
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
                {ability.can('create', 'Access') && (
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
          {isLoading && <TableSkeleton columns={4} rows={10} />}
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
                  totalPages={totalPages}
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
        title="Add Access"
        isOpen={addModalOpen}
        onClose={handleClose}
        refresh={fetchData}
      />
      <EditForm
        title="Edit Access"
        initValues={editData as Access}
        isOpen={editModalOpen}
        onClose={handleClose}
        refresh={fetchData}
      />
      <PromptConfirm
        title={'Delete Access'}
        description={`Are you sure you want to delete this ${accessName}?`}
        isOpen={deleteModalOpen}
        onClose={handleClose}
        onAccept={handleDelete}
      />
    </>
  );
}
