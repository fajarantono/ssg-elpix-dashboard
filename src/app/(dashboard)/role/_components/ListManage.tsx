'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { EditModalsProps } from '@/types/common';
import { getAllData, updatedWithQuery } from '@/services/api';
import TableSkeleton from '@/components/tables/TableSkeleton';
import ErrorPage from '@/components/pages/ErrorPage';
import { Controller, useForm } from 'react-hook-form';
import SwitchCustom from '@/components/form/switch/SwitchCustom';
import { DataRolePermission, MenuItem, Role, RolePermission } from '../_interfaces/Role';

const ListManage: React.FC<EditModalsProps<Role>> = ({
  title,
  initValues,
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DataRolePermission[]>([]);
  const [accessTypes, setAccessTypes] = useState<string[]>([]);
  const { reset, control } = useForm();

  const handleSwitchChange = async (accessId: string, newValue: boolean) => {
    if (!accessId) return;
    const url = `/api/v1/permission/${accessId}/change-active?isActive=${newValue}`;

    try {
      await updatedWithQuery(url);
      fetchData();
    } catch (error) {
      console.error('Gagal update akses:', error);
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await getAllData(
        `/api/v1/permission?roleId=${initValues.id}`,
      );

      if (!res.data) {
        setData([]);
        return;
      }

      const accessSet = new Set<string>();
      const menuMap: Record<string, MenuItem> = {};

      res.data.forEach((rolePermission: RolePermission) => {
        rolePermission.menus.forEach((menu) => {
          if (!menuMap[menu.id]) {
            menuMap[menu.id] = {
              id: menu.id,
              parentId: menu.parentId || null,
              name: menu.name,
              sequenceNo: menu.sequenceNo,
              accesses: {},
              children: [],
            };
          }

          if (Array.isArray(menu.accesses)) {
            menu.accesses.forEach((access) => {
              accessSet.add(access.name);
              menuMap[menu.id].accesses[access.name] = {
                id: access.id,
                name: access.name,
                isActive: access.isActive ?? false,
              };
            });
          }
        });
      });

      const structuredData: MenuItem[] = [];
      Object.values(menuMap).forEach((menu) => {
        if (menu.parentId) {
          menuMap[menu.parentId] ||= {
            id: menu.parentId,
            parentId: null,
            name: '',
            sequenceNo: 9999,
            accesses: {},
            children: [],
          };

          menuMap[menu.parentId].children!.push(menu);
        } else {
          structuredData.push(menu);
        }
      });

      setAccessTypes([...accessSet]);
      setData(structuredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [initValues]);

  useEffect(() => {
    if (isOpen && initValues) {
      setIsLoading(true);
      reset();
      fetchData();
    }
  }, [initValues, reset, isOpen, fetchData]);

  const handleClose = () => {
    reset();
    onClose();
  };

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderMenuRow = (row: MenuItem, level = 0): React.ReactNode => (
    <>
      <tr>
        <td
          className={`pl-${
            level * 4
          } font-semibold text-gray-800 dark:text-white/90`}
        >
          {row.name}
        </td>
        {accessTypes.map((accessType) => {
          const accessData = row.accesses?.[accessType] || {
            id: '',
            isActive: false,
          };

          return (
            <td key={accessType} align="center">
              <Controller
                name={`accesses.${row.id}.${accessType}`}
                control={control}
                render={({ field }) => (
                  <SwitchCustom
                    defaultChecked={field.value}
                    onChange={(checked) => {
                      field.onChange(checked);
                      handleSwitchChange(accessData.id, checked);
                    }}
                  />
                )}
              />
            </td>
          );
        })}
      </tr>
      {row.children?.map((child) => renderMenuRow(child, level + 1))}
    </>
  );

  return (
    <>
      <Modal
        className="top-0 mt-4 max-w-[1200px] overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900"
        isOpen={isOpen}
        onClose={handleClose}
      >
        <div className="p-6">
          <h2 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
            {title}
          </h2>
          <>
            {isLoading && <TableSkeleton columns={5} rows={10} />}
            {error && <ErrorPage />}
            {!isLoading && !error && (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[1102px]">
                    <thead className=" bg-gray-50 dark:border-white/90 dark:bg-gray-900">
                      <tr>
                        <th className="px-5 py-3 text-left sm:px-6">
                          <span className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                            Nama Menu
                          </span>
                        </th>
                        {accessTypes.map((accessType) => (
                          <th
                            key={accessType}
                            className="px-5 py-3 text-left sm:px-6 border-l dark:border-white/90"
                            style={{ inlineSize: 60 + 'px' }}
                          >
                            <span className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                              {accessType}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="border-t dark:border-white/90">
                      {data.map((menu) => (
                        <React.Fragment key={menu.id}>
                         
                          <tr>
                            <td className="px-5 py-4 sm:px-6 border-t">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {menu.name}
                              </span>
                            </td>
                            {accessTypes.map((accessType) => {
                              const accessData = menu.accesses?.[
                                accessType
                              ] || {
                                id: '',
                                isActive: false,
                              };
                              return (
                                <td
                                  key={accessType}
                                  className="px-4 py-2 border-l border-b"
                                >
                                  <Controller
                                    name={`accesses.${menu.id}.${accessType}`}
                                    control={control}
                                    defaultValue={accessData.isActive}
                                    render={({ field }) => (
                                      <SwitchCustom
                                        defaultChecked={field.value}
                                        onChange={(checked) => {
                                          field.onChange(checked);
                                          handleSwitchChange(
                                            accessData.id,
                                            checked,
                                          );
                                        }}
                                      />
                                    )}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                          {menu.children?.map((subMenu) => (
                            <tr key={subMenu.id}>
                              <td className="px-4 py-2 border-t pl-6">
                                <li className="text-gray-500 text-theme-sm dark:text-gray-400">
                                  {subMenu.name}
                                </li>
                              </td>
                              {accessTypes.map((accessType) => {
                                const accessData = subMenu.accesses?.[
                                  accessType
                                ] || { id: '', isActive: false };
                                return (
                                  <td
                                    key={accessType}
                                    className="px-4 py-2 border-l border-b text-center"
                                  >
                                    <Controller
                                      name={`accesses.${subMenu.id}.${accessType}`}
                                      control={control}
                                      defaultValue={accessData.isActive}
                                      render={({ field }) => (
                                        <SwitchCustom
                                          defaultChecked={field.value}
                                          onChange={(checked) => {
                                            field.onChange(checked);
                                            handleSwitchChange(
                                              accessData.id,
                                              checked,
                                            );
                                          }}
                                        />
                                      )}
                                    />
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        </div>
      </Modal>
    </>
  );
};

export default ListManage;