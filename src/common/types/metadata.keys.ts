export const DESIGN_TYPE = "design:type" as const;
export const DESIGN_PARAMTYPES = "design:paramtypes" as const;
export const DESIGN_RETURNTYPE = "design:returntype" as const;

export const INJECTABLE = "injectable:metadata" as const;
export const INJECT = "inject:metadata" as const;

export const MODULE_IMPORTS = "module:imports" as const;
export const MODULE_PROVIDERS = "module:providers" as const;
export const MODULE_CONTROLLERS = "module:controllers" as const;

export const MODULE_CONTROLLERS_PREFIX = "module:controllers:prefix" as const;
export const MODULE_CONTROLLERS_REQUEST = "module:controllers:request" as const;
export const MODULE_CONTROLLERS_REQUEST_ARGS = "module:controllers:request:args" as const;
export const MODULE_PIPES_KEY = 'module:controllers:pipes';
export const MODULE_GUARDS_KEY = 'module:guards';
export const MODULE_INTERCEPTORS_KEY = 'custom:interceptors';

export const MODULE_FILTERS_KEY = 'custom:filters';
export const FILTER_CATCH_EXCEPTIONS = 'custom:filter-catch-exceptions';
