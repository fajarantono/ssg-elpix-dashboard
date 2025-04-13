'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAbility } from '@/context/AbilityContext';
import { Menu } from '../_interfaces/Menu';
import { ColumnProps } from '@/types/common';
import { deleted, getAllData } from '@/services/api';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import TableSkeleton from '@/components/tables/TableSkeleton';
import ErrorPage from '@/components/pages/ErrorPage';
import SearchInput from '@/components/tables/SearchInput';
import Badge from '@/components/ui/badge/Badge';
import PromptConfirm from '@/components/common/PromptConfirm';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import AddForm from './AddForm';
import EditForm from './EditForm';
import TableTreeView from '@/components/tables/TableTreeView';
import { useMenu } from '@/context/MenuContext';
import Icon from '@/components/ui/icon';

export default function ListData() {
  const [data, setData] = useState<Menu[]>([]);
  const [editData, setEditData] = useState<Menu | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [menuId, setMenuId] = useState<string>('');
  const [MenuName, setMenuName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { refreshMenu } = useMenu();

  const t = useTranslations('index');

  const ability = useAbility();

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleDelete = () => {
    deleted('/api/v1/menu', menuId)
      .then((res) => {
        if (res) {
          toast.success(`${res.message}`, {
            position: 'top-right',
            autoClose: 5000,
            theme: 'colored',
          });
          setDeleteModalOpen(false);
          fetchData();
          refreshMenu();
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
      const res = await getAllData(`/api/v1/menu/access?search=${searchTerm}`);

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData, searchTerm]);

  const ListColumn: ColumnProps<Menu>[] = [
    {
      key: 'name',
      title: t('label.name'),
      align: 'left',
      render: (row) => <span className="truncate">{row.name}</span>,
    },
    {
      key: 'alias',
      title: t('label.alias'),
      align: 'left',
      render: (row) => <span className="truncate">{row.alias}</span>,
    },
    {
      key: 'url',
      title: t('label.url'),
      align: 'left',
      render: (row) => (
        <span className="max-w-[500px] truncate font-normal text-gray-600 dark:text-white/90">
          {row.url}
        </span>
      ),
    },
    {
      key: 'icon',
      title: t('label.icon'),
      align: 'center',
      inlineSize: 100,
      render: (row) => {
        if (row.icon && row.icon.trim() !== '') {
          return (
            <>
              <div className="flex justify-center items-center w-full gap-2">
                <Icon name={row.icon} size={20} className="text-gray-500 dark:text-white/90" />
              </div>
            </>
          );
        }
        return null;
      },
    },
    {
      key: 'sequenceNo',
      title: t('label.sequenceNo'),
      align: 'center',
      render: (row) => <span className="text-center">{row.sequenceNo}</span>,
    },
    {
      key: 'isActive',
      title: t('label.status'),
      align: 'center',
      render: (row) => (
        <Badge size="sm" color={row.isActive ? 'success' : 'error'}>
          {row.isActive ? t('label.active') : t('label.inactive')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: t('label.actions'),
      align: 'center',
      inlineSize: 200,
      render: (row) => (
        <div className="flex justify-center items-center w-full gap-2">
          {ability.can('update', 'Menu') && (
            <Button
              size="xs"
              tooltip={`${t('label.edit')}`}
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 text-sm"
              variant="none"
              startIcon={<PencilIcon size="20" />}
              onClick={() => {
                setEditData(row);
                setEditModalOpen(true);
              }}
            />
          )}
          {ability.can('delete', 'Menu') && (
            <Button
              size="xs"
              tooltip={`${t('label.delete')}`}
              className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 text-sm"
              variant="none"
              startIcon={<Trash2Icon size="20" />}
              onClick={() => {
                setMenuId(row.id ?? '');
                setMenuName(row.name);
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
                  placeholder={`${t('placeholder.search')}...`}
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
                {ability.can('create', 'Menu') && (
                  <Button
                    size="sm"
                    onClick={handleAdd}
                    className="flex items-center"
                    startIcon={<PlusIcon />}
                  >
                    <span className="hidden sm:block">{t('label.addData')}</span>
                  </Button>
                )}
              </div>
            </div>
          )}
          {isLoading && <TableSkeleton columns={5} rows={10} />}
          {error && <ErrorPage />}
          {!isLoading && !error && (
            <TableTreeView
              columns={ListColumn}
              data={data}
              variant={{
                striped: true,
                sm: true,
                hover: true,
              }}
            />
          )}
        </div>
      </ComponentCard>

      <AddForm
        title={`${t('label.add')} Menu`}
        isOpen={addModalOpen}
        onClose={handleClose}
        refresh={fetchData}
      />
      <EditForm
        title={`${t('label.edit')} Menu`}
        initValues={editData as Menu}
        isOpen={editModalOpen}
        onClose={handleClose}
        refresh={fetchData}
      />
      <PromptConfirm
        title={`${t('label.delete')} Menu`}
        description={`${t('label.confirmDeleteText')} ${MenuName}`}
        isOpen={deleteModalOpen}
        onClose={handleClose}
        onAccept={handleDelete}
        cancelButtonLabel={t('label.canceled')}
        okButtonLabel={t('label.yesDelete')}
      />
    </>
  );
}
