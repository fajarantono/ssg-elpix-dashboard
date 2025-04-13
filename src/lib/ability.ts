import { PureAbility, AbilityBuilder, AbilityClass } from '@casl/ability';

type PermissionResponse = {
  role: { name: string };
  menus: {
    name: string;
    accesses: { name: string; isActive: boolean }[];
  }[];
};

export type AppAbility = PureAbility<[string, string]>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;

export function defineAbilityFor(permissions: PermissionResponse) {
  const { can, rules } = new AbilityBuilder(AppAbility);

    permissions.menus.forEach((menu) => {
    menu.accesses.forEach((access) => {
      if (access.isActive) {
        can(access.name.toLowerCase(), menu.name);
      }
    });
  });

  return new AppAbility(rules);
}
