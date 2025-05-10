'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { Role } from '../_interfaces/Role';
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
import { PencilIcon, PlusIcon, Settings, Trash2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import AddForm from './AddForm';
import EditForm from './EditForm';
import ListManage from './ListManage';

export default function ListData() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [data, setData] = useState<Role[]>([]);
  const [editData, setEditData] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);

  const [roleId, setRoleId] = useState<string>('');
  const [roleName, setRoleName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const ability = useAbility();

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleDelete = () => {
    deleted('/api/v1/role', roleId)
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
    setManageModalOpen(false);
  };

  const handleManage = () => {
    setManageModalOpen(true);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getAllData(
        `/api/v1/role?page=${page}&limit=${limit}&sort=DESC&search=${searchTerm}`,
      );

      setData(Array.isArray(res.data) ? res.data : []);
      setTotalPage(res?.pagination?.totalPages || 0);
      setTotal(res?.pagination?.totalItems || 0);
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

  const ListColumn: ColumnProps<Role>[] = [
    {
      key: 'name',
      title: 'Name',
      render: (row) => <span className="truncate font-medium">{row.name}</span>,
    },
    {
      key: 'description',
      title: 'Description',
      render: (row) => (
        <span className="max-w-[500px] truncate font-normal text-gray-600 dark:text-gray-400">
          {row.description}
        </span>
      ),
    },
    {
      key: 'isRoot',
      title: 'Root',
      align: 'center',
      inlineSize: 100,
      render: (row) => (
        <Badge size="sm" color={row.isRoot ? 'success' : 'error'}>
          {row.isRoot ? 'Root' : 'Not Root'}
        </Badge>
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
          {ability.can('update', 'Role') && (
            <Button
              size="xs"
              tooltip="Manage"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 text-sm"
              variant="none"
              startIcon={<Settings size="20" />}
              onClick={() => {
                setEditData(row);
                setRoleName(row.name);
                handleManage();
              }}
            />
          )}

          {ability.can('update', 'Role') && (
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
                setRoleId((row.id ?? '').toString());
                setRoleName(row.name);
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
                {ability.can('create', 'Role') && (
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
          {isLoading && <TableSkeleton columns={6} rows={10} />}
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
        title="Add Role"
        isOpen={addModalOpen}
        onClose={handleClose}
        refresh={fetchData}
      />
      <EditForm
        title="Edit Role"
        initValues={editData as Role}
        isOpen={editModalOpen}
        onClose={handleClose}
        refresh={fetchData}
      />
      <PromptConfirm
        title={'Delete Role'}
        description={`Are you sure you want to delete this ${roleName}?`}
        isOpen={deleteModalOpen}
        onClose={handleClose}
        onAccept={handleDelete}
      />
      <ListManage
        title={`Permission: ${roleName}`}
        initValues={editData as Role}
        isOpen={manageModalOpen}
        onClose={handleClose}
        refresh={fetchData}
      />
    </>
  );
}
