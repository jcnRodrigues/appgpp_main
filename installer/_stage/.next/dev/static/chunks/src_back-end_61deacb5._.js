(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/back-end/components/ui/sheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sheet",
    ()=>Sheet,
    "SheetClose",
    ()=>SheetClose,
    "SheetContent",
    ()=>SheetContent,
    "SheetDescription",
    ()=>SheetDescription,
    "SheetFooter",
    ()=>SheetFooter,
    "SheetHeader",
    ()=>SheetHeader,
    "SheetTitle",
    ()=>SheetTitle,
    "SheetTrigger",
    ()=>SheetTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Sheet({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "sheet",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
_c = Sheet;
function SheetTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "sheet-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
        lineNumber: 16,
        columnNumber: 10
    }, this);
}
_c1 = SheetTrigger;
function SheetClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        "data-slot": "sheet-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
_c2 = SheetClose;
function SheetPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "sheet-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
        lineNumber: 28,
        columnNumber: 10
    }, this);
}
_c3 = SheetPortal;
function SheetOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "sheet-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c4 = SheetOverlay;
function SheetContent({ className, children, side = "right", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetOverlay, {}, void 0, false, {
                fileName: "[project]/src/back-end/components/ui/sheet.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "sheet-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500", side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm", side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm", side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b", side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/ui/sheet.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/ui/sheet.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/back-end/components/ui/sheet.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c5 = SheetContent;
function SheetHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sheet-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-1.5 p-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_c6 = SheetHeader;
function SheetFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sheet-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-auto flex flex-col gap-2 p-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_c7 = SheetFooter;
function SheetTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "sheet-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-foreground font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_c8 = SheetTitle;
function SheetDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "sheet-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/ui/sheet.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_c9 = SheetDescription;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Sheet");
__turbopack_context__.k.register(_c1, "SheetTrigger");
__turbopack_context__.k.register(_c2, "SheetClose");
__turbopack_context__.k.register(_c3, "SheetPortal");
__turbopack_context__.k.register(_c4, "SheetOverlay");
__turbopack_context__.k.register(_c5, "SheetContent");
__turbopack_context__.k.register(_c6, "SheetHeader");
__turbopack_context__.k.register(_c7, "SheetFooter");
__turbopack_context__.k.register(_c8, "SheetTitle");
__turbopack_context__.k.register(_c9, "SheetDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/back-end/components/Header/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-client] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2d$backup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DatabaseBackup$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database-backup.js [app-client] (ecmascript) <export default as DatabaseBackup>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__KeyRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/key-round.js [app-client] (ecmascript) <export default as KeyRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LandmarkIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/landmark.js [app-client] (ecmascript) <export default as LandmarkIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LaptopIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/laptop.js [app-client] (ecmascript) <export default as LaptopIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/monitor.js [app-client] (ecmascript) <export default as Monitor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PackagePlusIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package-plus.js [app-client] (ecmascript) <export default as PackagePlusIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserSearchIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-search.js [app-client] (ecmascript) <export default as UserSearchIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$cog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCog$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-cog.js [app-client] (ecmascript) <export default as UserCog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/components/ui/sheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$Providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/components/Providers/ThemeProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/* eslint-disable @next/next/no-img-element */ "use client";
;
;
;
;
;
;
;
;
function Header() {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const { mode, setMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$Providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const userFormularios = session?.user?.formularios;
    const canView = (required)=>!required || !userFormularios || userFormularios.includes(required);
    const menuItens = [
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
            label: "Home",
            href: "/",
            required: "DASHBOARD"
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
            label: "Funcionários",
            href: "/funcionariosadd",
            required: "FUNCIONARIOS"
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LaptopIcon$3e$__["LaptopIcon"],
            label: "Patrimônio",
            href: "/patrimoniolist",
            required: "PATRIMONIO"
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
            label: "Monitor de Rede Ubiquiti",
            href: "/monitor-patrimonios",
            required: "UNIFI_CONFIG"
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LandmarkIcon$3e$__["LandmarkIcon"],
            label: "Centros de Custo",
            href: "/ccustos",
            required: "CENTRO_CUSTO"
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"],
            label: "Medição por Centro de Custo",
            href: "/ccusto/medicao",
            required: "MEDICAO_CCUSTO"
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserSearchIcon$3e$__["UserSearchIcon"],
            label: "Função",
            href: "/funcoes",
            required: "FUNCOES"
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__KeyRound$3e$__["KeyRound"],
            label: "Licenças de Software",
            href: "/licencas",
            required: "LICENCAS_SOFTWARE"
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PackagePlusIcon$3e$__["PackagePlusIcon"],
            label: "Alocação de Patrimonios",
            href: "/alocacoes",
            required: "ALOCACOES"
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2d$backup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DatabaseBackup$3e$__["DatabaseBackup"],
            label: "Importar e Exportar Dados",
            href: "/sistema-dados",
            required: "IMPORTACAO_EXPORTACAO"
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$cog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCog$3e$__["UserCog"],
            label: "Acesso de Usuarios",
            href: "/acesso-usuarios",
            required: "ACESSO_USUARIOS"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "sticky top-0 z-50 flex justify-between items-center mb-6 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-h1 font-extrabold selected-none drop-shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex items-center gap-2 px-4 py-2 rounded-2xl   shadow  text-[#0f5132] font-bold text-lg tracking-tight",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/Imagens/image31_2.svg",
                            alt: "Logo App GPP",
                            width: 172,
                            height: 160,
                            className: "rounded-sm"
                        }, void 0, false, {
                            fileName: "[project]/src/back-end/components/Header/Header.tsx",
                            lineNumber: 52,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/back-end/components/Header/Header.tsx",
                        lineNumber: 51,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/back-end/components/Header/Header.tsx",
                    lineNumber: 49,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                lineNumber: 48,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center rounded-full border border-border bg-card p-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setMode("system"),
                                "aria-label": "Tema do sistema",
                                className: `h-9 w-9 rounded-full grid place-items-center transition-colors ${mode === "system" ? "bg-accent/20 text-accent ring-1 ring-accent/35" : "text-foreground hover:bg-secondary"}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__["Monitor"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                    lineNumber: 70,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                lineNumber: 64,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setMode("light"),
                                "aria-label": "Tema claro",
                                className: `h-9 w-9 rounded-full grid place-items-center transition-colors ${mode === "light" ? "bg-accent/20 text-accent ring-1 ring-accent/35" : "text-foreground hover:bg-secondary"}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                    lineNumber: 78,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                lineNumber: 72,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setMode("dark"),
                                "aria-label": "Tema escuro",
                                className: `h-9 w-9 rounded-full grid place-items-center transition-colors ${mode === "dark" ? "bg-accent/20 text-accent ring-1 ring-accent/35" : "text-foreground hover:bg-secondary"}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                    lineNumber: 86,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                lineNumber: 80,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/back-end/components/Header/Header.tsx",
                        lineNumber: 63,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-card p-3 rounded-full border border-transparent dark:border-border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"], {
                            open: open,
                            onOpenChange: setOpen,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                            className: "h-6 w-6 text-primary "
                                        }, void 0, false, {
                                            fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                            lineNumber: 93,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                        lineNumber: 92,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                    lineNumber: 91,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"], {
                                    className: "border-l border-accent/30 p-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-full min-h-0 flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetHeader"], {
                                                className: "shrink-0 border-b border-border px-4 py-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTitle"], {
                                                    className: "text-primary text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            src: "/Imagens/image31_2.svg",
                                                            alt: "Logo App GPP",
                                                            width: 50,
                                                            height: 50,
                                                            className: "rounded-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                            lineNumber: 100,
                                                            columnNumber: 41
                                                        }, this),
                                                        "Menu"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                    lineNumber: 99,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                lineNumber: 98,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
                                                children: status === "authenticated" && session ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-4 mt-6 border-b border-border pb-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-14 w-14 rounded-full overflow-hidden flex-shrink-0",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: session.user?.image || `${"/Imagens/image31_2.svg"}`,
                                                                        alt: session.user?.name || "User Avatar",
                                                                        className: "h-full w-full object-cover items-center"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                        lineNumber: 115,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                    lineNumber: 114,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-bold text-foreground",
                                                                            children: session.user?.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                            lineNumber: 121,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm text-muted-foreground",
                                                                            children: session.user?.email
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                            lineNumber: 122,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                    lineNumber: 120,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                            lineNumber: 113,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-6 flex flex-col gap-5",
                                                            children: [
                                                                menuItens.filter((item)=>canView(item.required)).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: item.href,
                                                                        onClick: ()=>setOpen(false),
                                                                        className: "flex items-center gap-4 text-lg text-primary hover:text-accent transition-colors",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                                className: "w-6 h-6 text-accent"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                                lineNumber: 133,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            item.label
                                                                        ]
                                                                    }, item.label, true, {
                                                                        fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                        lineNumber: 127,
                                                                        columnNumber: 53
                                                                    }, this)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])();
                                                                        setOpen(false);
                                                                    },
                                                                    className: "flex items-center gap-4 text-red-500 hover:text-red-600 transition-colors",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                                            className: "w-6 h-6 text-red-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                            lineNumber: 143,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        "Sair"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                    lineNumber: 137,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col gap-3 mt-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signIn"])('google'),
                                                                className: "flex items-center gap-2 w-[90%] justify-center bg-white text-gray-800 border border-gray-300 hover:bg-gray-100",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        width: "20",
                                                                        height: "20",
                                                                        viewBox: "0 0 20 20",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M19.8055 8.0415H19V8H10V12H15.4045C14.7916 14.1276 12.8882 15.7526 10.5 15.7526C7.42616 15.7526 4.94018 13.2667 4.94018 10.1929C4.94018 7.11902 7.42616 4.63297 10.5 4.63297C11.9366 4.63297 13.2262 5.19015 14.1908 6.09523L17.1898 3.09523C15.4123 1.45032 13.0476 0.383789 10.5 0.383789C5.25215 0.383789 1 4.6359 1 9.88374C1 15.1316 5.25215 19.3837 10.5 19.3837C15.2467 19.3837 19.1639 16.0273 19.8382 11.7501C19.9398 10.9256 20 10.0523 19.9944 9.17309C19.9726 8.79159 19.9071 8.41008 19.8055 8.0415Z",
                                                                                fill: "#FFC107"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                                lineNumber: 156,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M2.42683 5.88798L5.92215 8.47418C6.73156 6.27523 8.46115 4.63297 10.5 4.63297C11.9366 4.63297 13.2262 5.19015 14.1907 6.09523L17.1898 3.09523C15.4123 1.45032 13.0476 0.383789 10.5 0.383789C7.05305 0.383789 4.03306 2.64633 2.42683 5.88798Z",
                                                                                fill: "#FF3D00"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                                lineNumber: 157,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M10.5 19.3837C13.0005 19.3837 15.2264 18.3599 16.9122 16.7356L13.6494 13.9906C12.7122 14.6787 11.6095 15.0689 10.5 15.0689C8.13156 15.0689 6.10297 13.4805 5.49335 11.2091L2.0658 13.8093C3.68417 17.1245 6.87874 19.3837 10.5 19.3837Z",
                                                                                fill: "#4CAF50"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                                lineNumber: 158,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M19.8055 8.0415H19V8H10V12H15.4045C15.1097 12.9379 14.5461 13.7837 13.7998 14.4261L13.8002 14.4257L16.9114 17.1115C16.7344 17.2714 19.9999 15.0001 19.9999 10.0001C19.9999 9.36999 19.9359 8.72378 19.8055 8.0415Z",
                                                                                fill: "#1976D2"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                                lineNumber: 159,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                        lineNumber: 155,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    "Login Google"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                lineNumber: 151,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signIn"])('credentials'),
                                                                className: "w-[90%] justify-center",
                                                                children: "Login Local"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                        lineNumber: 150,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false)
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                                lineNumber: 110,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                        lineNumber: 97,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/back-end/components/Header/Header.tsx",
                                    lineNumber: 96,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/back-end/components/Header/Header.tsx",
                            lineNumber: 90,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/back-end/components/Header/Header.tsx",
                        lineNumber: 89,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/back-end/components/Header/Header.tsx",
                lineNumber: 62,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/back-end/components/Header/Header.tsx",
        lineNumber: 47,
        columnNumber: 9
    }, this);
}
_s(Header, "eA8jxiqyPuTFO25064LgXf781vY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$Providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/back-end/hooks/useEnterToNext.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEnterToNext",
    ()=>useEnterToNext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useEnterToNext() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEnterToNext.useCallback": (e)=>{
            if (e.key !== "Enter") return;
            const target = e.target;
            if (!target) return;
            const tag = target.tagName;
            if (tag === "TEXTAREA") return;
            if (tag !== "INPUT" && tag !== "SELECT") return;
            const input = target;
            if (input.type === "submit") return;
            const form = e.currentTarget;
            const focusables = Array.from(form.querySelectorAll('input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])')).filter({
                "useEnterToNext.useCallback.focusables": (el)=>{
                    const disabled = el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true";
                    return !disabled && !el.hasAttribute("hidden");
                }
            }["useEnterToNext.useCallback.focusables"]);
            const index = focusables.indexOf(target);
            if (index === -1) return;
            e.preventDefault();
            const next = focusables[index + 1] ?? focusables[0];
            next.focus();
        }
    }["useEnterToNext.useCallback"], []);
}
_s(useEnterToNext, "epj4qY15NHsef74wNqHIp5fdZmg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/back-end/components/MedicaoCCustoForm/ConferirPatrimoniosButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConferirPatrimoniosButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/components/ui/button.tsx [app-client] (ecmascript)");
'use client';
;
;
function ConferirPatrimoniosButton({ loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        type: "submit",
        className: "bg-primary hover:bg-primary/90",
        disabled: loading,
        children: loading ? 'Processando...' : 'Conferir Patrimonios'
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/ConferirPatrimoniosButton.tsx",
        lineNumber: 7,
        columnNumber: 9
    }, this);
}
_c = ConferirPatrimoniosButton;
var _c;
__turbopack_context__.k.register(_c, "ConferirPatrimoniosButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/back-end/components/MedicaoCCustoForm/GerarRelatorioMedicaoButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GerarRelatorioMedicaoButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/components/ui/button.tsx [app-client] (ecmascript)");
'use client';
;
;
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}
function formatarMoedaOuTraco(valor) {
    return valor === null ? '-' : formatarMoeda(valor);
}
function escaparCsv(valor) {
    return `"${String(valor).replace(/"/g, '""')}"`;
}
function GerarRelatorioMedicaoButton({ resultado, disabled, onRegistrarBm }) {
    const handleGerarRelatorio = async ()=>{
        if (!resultado) return;
        const valorDivergentes = resultado.resultados.filter((r)=>r.status === 'VALOR_DIVERGENTE').reduce((acc, r)=>acc + Math.abs((r.valorInformado ?? 0) - (r.valorSistema ?? 0)), 0);
        const valorNaoEncontrados = resultado.resultados.filter((r)=>r.status === 'NAO_ENCONTRADO').reduce((acc, r)=>acc + (r.valorInformado ?? 0), 0);
        const valorInvalidos = resultado.resultados.filter((r)=>r.status === 'INVALIDO').reduce((acc, r)=>acc + (r.valorInformado ?? 0), 0);
        const valorNaoInformados = resultado.naoInformados.reduce((acc, r)=>acc + (r.valorSistema ?? 0), 0);
        const valorTotalLinhas = resultado.resultados.reduce((acc, r)=>acc + (r.valorSistema ?? 0), 0);
        const valorOk = resultado.resultados.filter((r)=>r.status === 'OK').reduce((acc, r)=>acc + (r.valorSistema ?? 0), 0);
        const linhas = [];
        linhas.push('RELATORIO DE MEDICAO');
        linhas.push(`Data/Hora;${new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        })}`);
        linhas.push('');
        linhas.push('RESUMO');
        linhas.push('Indicador;Quantidade;Valor');
        linhas.push(`OK;${resultado.resumo.ok};${formatarMoeda(valorOk)}`);
        linhas.push(`Valor divergente;${resultado.resumo.divergentes};${formatarMoeda(valorDivergentes)}`);
        linhas.push(`Nao encontrado;${resultado.resumo.naoEncontrados};${formatarMoeda(valorNaoEncontrados)}`);
        linhas.push(`Linha invalida;${resultado.resumo.invalidos};${formatarMoeda(valorInvalidos)}`);
        linhas.push(`Nao informados no arquivo;${resultado.naoInformados.length};${formatarMoeda(valorNaoInformados)}`);
        linhas.push(`Total de linhas;${resultado.resumo.totalLinhas};${formatarMoeda(valorTotalLinhas)}`);
        linhas.push('');
        linhas.push('DETALHE DA CONFERENCIA');
        linhas.push('Linha;ID Patrimonio;Matricula Alocada;Status Patrimonio;Valor Informado;Valor Sistema;Movimentos do Patrimonio;Status;Mensagem');
        for (const item of resultado.resultados){
            linhas.push([
                item.linha,
                escaparCsv(`${item.idPat || '-'}\n${item.descricaoPat || 'Sem descricao'}`),
                escaparCsv(`${item.matriculaAlocada || '-'}\n${item.nomeFuncionarioAlocado || '-'}`),
                escaparCsv(item.statusPatrimonio || 'SEM STATUS'),
                escaparCsv(formatarMoedaOuTraco(item.valorInformado)),
                escaparCsv(formatarMoedaOuTraco(item.valorSistema)),
                escaparCsv(item.movimentosPatrimonio || '-'),
                escaparCsv(item.status),
                escaparCsv(item.mensagem)
            ].join(';'));
        }
        linhas.push('');
        linhas.push('PATRIMONIOS NAO INFORMADOS');
        linhas.push('ID Patrimonio;Descricao;Valor Sistema;Situacao;Detalhe');
        for (const item of resultado.naoInformados){
            linhas.push([
                escaparCsv(item.idPat),
                escaparCsv(item.descricaoPat || 'Sem descricao'),
                escaparCsv(formatarMoeda(item.valorSistema ?? 0)),
                escaparCsv(item.statusPatrimonio || 'SEM STATUS'),
                escaparCsv(item.detalheDevolucao || '-')
            ].join(';'));
        }
        const conteudo = `\uFEFF${linhas.join('\n')}`;
        const blob = new Blob([
            conteudo
        ], {
            type: 'text/csv;charset=utf-8;'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const nomeArquivo = await onRegistrarBm?.('excel') || 'relatorio-medicao.csv';
        link.download = nomeArquivo.endsWith('.csv') ? nomeArquivo : `${nomeArquivo}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        type: "button",
        onClick: handleGerarRelatorio,
        disabled: !resultado || disabled,
        children: "Gerar Relatorio da Medicao"
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/GerarRelatorioMedicaoButton.tsx",
        lineNumber: 136,
        columnNumber: 9
    }, this);
}
_c = GerarRelatorioMedicaoButton;
var _c;
__turbopack_context__.k.register(_c, "GerarRelatorioMedicaoButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/back-end/components/MedicaoCCustoForm/relatorioNomeBM.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "gerarNomeArquivoBM",
    ()=>gerarNomeArquivoBM
]);
'use client';
function normalizarCodigoCentro(codigoCentroCusto) {
    const digits = String(codigoCentroCusto || '').replace(/\D/g, '');
    if (!digits) return '0000';
    return digits.padStart(4, '0').slice(-4);
}
function obterMesAnoAgora() {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = String(agora.getFullYear()).slice(-2);
    return {
        mes,
        ano
    };
}
function normalizarMesAno(mes, ano) {
    const atual = obterMesAnoAgora();
    const mesDigits = String(mes ?? '').replace(/\D/g, '');
    const anoDigits = String(ano ?? '').replace(/\D/g, '');
    let mesFinal = mesDigits.padStart(2, '0').slice(-2);
    if (!mesFinal || Number(mesFinal) < 1 || Number(mesFinal) > 12) {
        mesFinal = atual.mes;
    }
    let anoFinal = anoDigits.slice(-2);
    if (!anoFinal || anoFinal.length !== 2) {
        anoFinal = atual.ano;
    }
    return {
        mes: mesFinal,
        ano: anoFinal
    };
}
function gerarNomeArquivoBM(codigoCentroCusto, extensao, mesBm, anoBm) {
    const codigo = normalizarCodigoCentro(codigoCentroCusto);
    const { mes, ano } = normalizarMesAno(mesBm, anoBm);
    const chaveContador = `bm_counter_${codigo}_${mes}${ano}`;
    let contadorAtual = 0;
    try {
        const salvo = window.localStorage.getItem(chaveContador);
        contadorAtual = Number.parseInt(salvo || '0', 10);
        if (Number.isNaN(contadorAtual) || contadorAtual < 0) contadorAtual = 0;
    } catch  {
        contadorAtual = 0;
    }
    const proximo = contadorAtual + 1;
    try {
        window.localStorage.setItem(chaveContador, String(proximo));
    } catch  {
    // Sem persistência local: segue com contador em memória do momento.
    }
    const contador = String(proximo).padStart(2, '0');
    return `BM${codigo}${mes}${ano}-${contador}.${extensao}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/back-end/components/MedicaoCCustoForm/GerarRelatorioMedicaoPdfButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GerarRelatorioMedicaoPdfButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$MedicaoCCustoForm$2f$relatorioNomeBM$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/components/MedicaoCCustoForm/relatorioNomeBM.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}
function formatarMoedaOuTraco(valor) {
    return valor === null ? '-' : formatarMoeda(valor);
}
function pdfSafeText(valor) {
    return String(valor).replace(/[\u2013\u2014]/g, '-')// Preserva quebras de linha para células com conteúdo em duas linhas
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ');
}
function kindStatusPatrimonio(status) {
    const s = status.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    if (s.includes('ATIVO')) return 'ok';
    if (s.includes('DEVOLUCAO')) return 'error';
    if (s.includes('INATIVO')) return 'warn';
    if (s.includes('MANUTENCAO')) return 'neutral';
    if (s.includes('TRANSFERIDO')) return 'neutral';
    return 'neutral';
}
function truncarTextoPdf(pdf, texto, larguraMax) {
    const limpo = pdfSafeText(texto || '');
    if (pdf.getTextWidth(limpo) <= larguraMax) return limpo;
    let base = limpo;
    while(base.length > 0 && pdf.getTextWidth(`${base}...`) > larguraMax){
        base = base.slice(0, -1);
    }
    return base ? `${base}...` : '...';
}
function GerarRelatorioMedicaoPdfButton({ resultado, disabled, codigoCentroCusto, centroCustoLabel, periodoInicioMedicao, periodoFimMedicao, mesBm, anoBm }) {
    const handleGerarPdf = ()=>{
        if (!resultado) return;
        const nomeArquivoPdf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$MedicaoCCustoForm$2f$relatorioNomeBM$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gerarNomeArquivoBM"])(codigoCentroCusto, 'pdf', mesBm, anoBm);
        const nomenclaturaBm = nomeArquivoPdf.replace(/\.pdf$/i, '');
        const valorDivergentes = resultado.resultados.filter((r)=>r.status === 'VALOR_DIVERGENTE').reduce((acc, r)=>acc + Math.abs((r.valorInformado ?? 0) - (r.valorSistema ?? 0)), 0);
        const valorNaoEncontrados = resultado.resultados.filter((r)=>r.status === 'NAO_ENCONTRADO').reduce((acc, r)=>acc + (r.valorInformado ?? 0), 0);
        const valorInvalidos = resultado.resultados.filter((r)=>r.status === 'INVALIDO').reduce((acc, r)=>acc + (r.valorInformado ?? 0), 0);
        const valorNaoInformados = resultado.naoInformados.reduce((acc, r)=>acc + (r.valorSistema ?? 0), 0);
        const valorTotalLinhas = resultado.resultados.reduce((acc, r)=>acc + (r.valorSistema ?? 0), 0);
        const valorOk = resultado.resultados.filter((r)=>r.status === 'OK').reduce((acc, r)=>acc + (r.valorSistema ?? 0), 0);
        const agora = new Date();
        const inicioConferencia = periodoInicioMedicao ? new Date(`${periodoInicioMedicao}T00:00:00`) : new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0);
        const fimConferencia = periodoFimMedicao ? new Date(`${periodoFimMedicao}T23:59:59`) : agora;
        const formatoDataHora = (d)=>d.toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo'
            });
        const pdf = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pageWidth - margin * 2;
        let y = 12;
        const ensureSpace = (needed)=>{
            if (y + needed > pageHeight - 10) {
                pdf.addPage();
                y = 12;
            }
        };
        const drawCard = (x, top, w, h, title, qtd, valor, color)=>{
            pdf.setDrawColor(220, 226, 232);
            pdf.setFillColor(250, 251, 252);
            pdf.roundedRect(x, top, w, h, 1.8, 1.8, 'FD');
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(86, 98, 114);
            pdf.text(pdfSafeText(title), x + 2, top + 5);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(color[0], color[1], color[2]);
            pdf.setFontSize(12);
            pdf.text(pdfSafeText(qtd), x + 2, top + 10.5);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(86, 98, 114);
            pdf.text(pdfSafeText(valor), x + 2, top + 15);
        };
        const drawStatusBadge = (x, top, text, kind)=>{
            const palette = {
                ok: {
                    bg: [
                        226,
                        248,
                        236
                    ],
                    fg: [
                        15,
                        125,
                        67
                    ]
                },
                warn: {
                    bg: [
                        255,
                        238,
                        218
                    ],
                    fg: [
                        185,
                        83,
                        0
                    ]
                },
                error: {
                    bg: [
                        255,
                        224,
                        224
                    ],
                    fg: [
                        171,
                        34,
                        34
                    ]
                },
                neutral: {
                    bg: [
                        233,
                        238,
                        246
                    ],
                    fg: [
                        64,
                        83,
                        111
                    ]
                }
            };
            const p = palette[kind];
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(6.4);
            const textWidth = pdf.getTextWidth(text) + 3.2;
            pdf.setFillColor(p.bg[0], p.bg[1], p.bg[2]);
            pdf.roundedRect(x, top - 2.8, textWidth, 4.1, 2, 2, 'F');
            pdf.setTextColor(p.fg[0], p.fg[1], p.fg[2]);
            pdf.text(pdfSafeText(text), x + 1.6, top);
            return textWidth;
        };
        const measureStatusBadgeWidth = (text)=>{
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(6.4);
            return pdf.getTextWidth(text) + 3.2;
        };
        const addTableHeader = (headers, widths)=>{
            const fontSize = 9.2;
            const rowHeight = 11;
            const lineHeight = 3.4;
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(fontSize);
            ensureSpace(rowHeight);
            const totalWidth = widths.reduce((acc, w)=>acc + w, 0);
            pdf.setFillColor(34, 47, 67);
            pdf.rect(margin, y, totalWidth, rowHeight, 'F');
            let x = margin;
            pdf.setDrawColor(82, 96, 118);
            pdf.setLineWidth(0.55);
            pdf.setTextColor(245, 248, 255);
            for(let i = 0; i < headers.length; i += 1){
                pdf.rect(x, y, widths[i], rowHeight, 'S');
                const headerValue = headers[i];
                const lines = Array.isArray(headerValue) ? headerValue : [
                    headerValue
                ];
                for(let j = 0; j < lines.length; j += 1){
                    pdf.text(pdfSafeText(lines[j]), x + 1.6, y + 3.8 + j * lineHeight);
                }
                x += widths[i];
            }
            y += rowHeight;
            pdf.setTextColor(35, 43, 54);
        };
        const addTableRow = (cells, widths, opts)=>{
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(7.3);
            const lineHeight = 3.8;
            const split = cells.map((c, i)=>pdf.splitTextToSize(pdfSafeText(c), widths[i] - 3));
            const maxLines = Math.max(...split.map((s)=>s.length), 1);
            const rowHeight = Math.max(7, maxLines * lineHeight + 2);
            ensureSpace(rowHeight);
            let x = margin;
            pdf.setDrawColor(156, 170, 190);
            pdf.setLineWidth(0.42);
            for(let i = 0; i < cells.length; i += 1){
                pdf.rect(x, y, widths[i], rowHeight);
                const badge = opts?.statusBadges?.find((b)=>b.col === i);
                if (badge) {
                    const statusTxt = cells[i];
                    const badgeWidth = measureStatusBadgeWidth(statusTxt);
                    const badgeX = x + Math.max(1.2, (widths[i] - badgeWidth) / 2);
                    const badgeY = y + rowHeight / 2 + 1.2;
                    drawStatusBadge(badgeX, badgeY, statusTxt, badge.kind);
                } else if ((i === 1 || i === 2) && cells[i].includes('\n')) {
                    const [linhaPrincipal, ...resto] = cells[i].split('\n');
                    const linhaSecundaria = resto.join(' ').trim();
                    const larguraUtil = widths[i] - 3.2;
                    pdf.setTextColor(15, 23, 42);
                    pdf.setFontSize(7.3);
                    pdf.text(truncarTextoPdf(pdf, linhaPrincipal, larguraUtil), x + 1.5, y + 4.3);
                    if (linhaSecundaria) {
                        pdf.setTextColor(100, 116, 139);
                        pdf.setFontSize(6.1);
                        pdf.text(truncarTextoPdf(pdf, linhaSecundaria, larguraUtil), x + 1.5, y + 8.2);
                    }
                } else {
                    pdf.setTextColor(35, 43, 54);
                    const centralizar = !!opts?.centerCols?.includes(i);
                    if (centralizar) {
                        const blocoAltura = split[i].length * lineHeight;
                        const yCentro = y + (rowHeight - blocoAltura) / 2 + 3.2;
                        pdf.text(split[i], x + widths[i] / 2, yCentro, {
                            align: 'center'
                        });
                    } else {
                        pdf.text(split[i], x + 1.5, y + 4.3);
                    }
                }
                x += widths[i];
            }
            y += rowHeight;
        };
        // Cabeçalho
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(15);
        pdf.setTextColor(18, 24, 40);
        pdf.text('Relatório de Medição', margin, y);
        const bmText = pdfSafeText(`BM: ${nomenclaturaBm}`);
        const bmTextWidth = pdf.getTextWidth(bmText);
        pdf.text(bmText, pageWidth - margin - bmTextWidth, y);
        y += 6;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(86, 98, 114);
        pdf.text(pdfSafeText(`Data/Hora: ${formatoDataHora(agora)}`), margin, y);
        y += 5;
        pdf.text(pdfSafeText(`Centro de Custo: ${centroCustoLabel || 'Não informado'}`), margin, y);
        y += 5;
        pdf.text(pdfSafeText(`Período de conferência: Início ${formatoDataHora(inicioConferencia)} | Fim ${formatoDataHora(fimConferencia)}`), margin, y);
        y += 6;
        // Resumo cards (4)
        ensureSpace(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(35, 43, 54);
        pdf.setFontSize(10);
        pdf.text(pdfSafeText('Resumo de inconsistências da importação'), margin, y);
        y += 2;
        const gap = 2;
        const cW = (contentWidth - gap * 3) / 4;
        const cardTop = y + 3;
        drawCard(margin, cardTop, cW, 18, 'Valor divergente', String(resultado.resumo.divergentes), formatarMoeda(valorDivergentes), [
            185,
            83,
            0
        ]);
        drawCard(margin + cW + gap, cardTop, cW, 18, 'Não encontrado', String(resultado.resumo.naoEncontrados), formatarMoeda(valorNaoEncontrados), [
            171,
            34,
            34
        ]);
        drawCard(margin + (cW + gap) * 2, cardTop, cW, 18, 'Linha inválida', String(resultado.resumo.invalidos), formatarMoeda(valorInvalidos), [
            64,
            83,
            111
        ]);
        drawCard(margin + (cW + gap) * 3, cardTop, cW, 18, 'Não informados no arquivo', String(resultado.naoInformados.length), formatarMoeda(valorNaoInformados), [
            64,
            83,
            111
        ]);
        y = cardTop + 21;
        // Totais cards (5)
        ensureSpace(24);
        const cW5 = (contentWidth - gap * 4) / 5;
        const tTop = y + 2;
        drawCard(margin, tTop, cW5, 18, 'Total de linhas', String(resultado.resumo.totalLinhas), formatarMoeda(valorTotalLinhas), [
            35,
            43,
            54
        ]);
        drawCard(margin + (cW5 + gap) * 1, tTop, cW5, 18, 'OK', String(resultado.resumo.ok), formatarMoeda(valorOk), [
            15,
            125,
            67
        ]);
        drawCard(margin + (cW5 + gap) * 2, tTop, cW5, 18, 'Divergentes', String(resultado.resumo.divergentes), formatarMoeda(valorDivergentes), [
            185,
            83,
            0
        ]);
        drawCard(margin + (cW5 + gap) * 3, tTop, cW5, 18, 'Não encontrados', String(resultado.resumo.naoEncontrados), formatarMoeda(valorNaoEncontrados), [
            171,
            34,
            34
        ]);
        drawCard(margin + (cW5 + gap) * 4, tTop, cW5, 18, 'Inválidos', String(resultado.resumo.invalidos), formatarMoeda(valorInvalidos), [
            64,
            83,
            111
        ]);
        y = tTop + 22;
        // Tabela principal
        ensureSpace(18);
        y += 2;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(35, 43, 54);
        pdf.text(pdfSafeText('Detalhe da conferência'), margin, y);
        y += 3.5;
        const cols = [
            12,
            40,
            50,
            22,
            18,
            18,
            28,
            contentWidth - (12 + 40 + 50 + 22 + 18 + 18 + 28)
        ];
        addTableHeader([
            'Linha',
            [
                'ID',
                'Patrimônio'
            ],
            [
                'Matrícula',
                'Funcionário'
            ],
            [
                'Status',
                'Patrimônio'
            ],
            [
                'Valor',
                'Informado'
            ],
            [
                'Valor',
                'Sistema'
            ],
            [
                'Movimentos',
                'Patrimônio'
            ],
            'Status'
        ], cols);
        resultado.resultados.forEach((r)=>{
            let statusConferenciaKind = 'neutral';
            if (r.status === 'OK') statusConferenciaKind = 'ok';
            if (r.status === 'VALOR_DIVERGENTE') statusConferenciaKind = 'warn';
            if (r.status === 'NAO_ENCONTRADO') statusConferenciaKind = 'error';
            addTableRow([
                String(r.linha - 1),
                `${r.idPat || '-'}\n${r.descricaoPat || 'Sem descrição'}`,
                `${r.matriculaAlocada || '-'}\n${r.nomeFuncionarioAlocado || '-'}`,
                r.statusPatrimonio || 'SEM STATUS',
                formatarMoedaOuTraco(r.valorInformado),
                formatarMoedaOuTraco(r.valorSistema),
                r.movimentosPatrimonio || '-',
                r.mensagem
            ], cols, {
                centerCols: [
                    0,
                    4,
                    5,
                    6
                ],
                statusBadges: [
                    {
                        col: 3,
                        kind: kindStatusPatrimonio(r.statusPatrimonio || 'SEM STATUS')
                    },
                    {
                        col: 7,
                        kind: statusConferenciaKind
                    }
                ]
            });
        });
        // Seção "não vieram" sempre nova página
        pdf.addPage();
        y = 12;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(18, 24, 40);
        pdf.text(pdfSafeText('Patrimônios no centro de custo que não vieram no arquivo'), margin, y);
        y += 6;
        const cols2 = [
            20,
            46,
            24,
            28,
            contentWidth - (20 + 46 + 24 + 28)
        ];
        addTableHeader([
            [
                'ID',
                'Patrimônio'
            ],
            'Descrição',
            [
                'Valor',
                'Sistema'
            ],
            'Situação',
            'Detalhe'
        ], cols2);
        resultado.naoInformados.forEach((r)=>{
            addTableRow([
                r.idPat,
                r.descricaoPat || 'Sem descrição',
                formatarMoeda(r.valorSistema ?? 0),
                r.statusPatrimonio || 'SEM STATUS',
                r.detalheDevolucao || '-'
            ], cols2);
        });
        pdf.save(nomeArquivoPdf);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        type: "button",
        onClick: handleGerarPdf,
        disabled: !resultado || disabled,
        children: "Gerar Relatório PDF"
    }, void 0, false, {
        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/GerarRelatorioMedicaoPdfButton.tsx",
        lineNumber: 399,
        columnNumber: 9
    }, this);
}
_c = GerarRelatorioMedicaoPdfButton;
var _c;
__turbopack_context__.k.register(_c, "GerarRelatorioMedicaoPdfButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MedicaoCCustoForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$hooks$2f$useEnterToNext$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/hooks/useEnterToNext.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$MedicaoCCustoForm$2f$ConferirPatrimoniosButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/components/MedicaoCCustoForm/ConferirPatrimoniosButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$MedicaoCCustoForm$2f$GerarRelatorioMedicaoButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/components/MedicaoCCustoForm/GerarRelatorioMedicaoButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$MedicaoCCustoForm$2f$GerarRelatorioMedicaoPdfButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/back-end/components/MedicaoCCustoForm/GerarRelatorioMedicaoPdfButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function MedicaoCCustoForm({ centros }) {
    _s();
    const handleEnterToNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$hooks$2f$useEnterToNext$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEnterToNext"])();
    const [centroSelecionado, setCentroSelecionado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [arquivo, setArquivo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [erro, setErro] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resultado, setResultado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mostrarNaoInformados, setMostrarNaoInformados] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const hoje = new Date().toISOString().slice(0, 10);
    const [dataInicioMedicao, setDataInicioMedicao] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(hoje);
    const [dataFimMedicao, setDataFimMedicao] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(hoje);
    const dataAtual = new Date();
    const [mesBm, setMesBm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(String(dataAtual.getMonth() + 1).padStart(2, '0'));
    const [anoBm, setAnoBm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(String(dataAtual.getFullYear()));
    const compararIdPatrimonio = (a, b)=>a.localeCompare(b, 'pt-BR', {
            numeric: true,
            sensitivity: 'base'
        });
    const formatarMoeda = (valor)=>new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    const formatarMoedaOuTraco = (valor)=>valor === null ? '-' : formatarMoeda(valor);
    const centroSelecionadoObj = centros.find((c)=>c.idCCusto === centroSelecionado);
    const codigoCentroSelecionado = centroSelecionadoObj?.codigoCCusto || null;
    const centroSelecionadoLabel = centroSelecionadoObj ? `${centroSelecionadoObj.codigoCCusto ? `${centroSelecionadoObj.codigoCCusto} - ` : ''}${centroSelecionadoObj.descricaoCCusto || 'Sem descrição'}` : null;
    const resumoInconsistencias = resultado ? {
        divergentes: resultado.resumo.divergentes,
        naoEncontrados: resultado.resumo.naoEncontrados,
        invalidos: resultado.resumo.invalidos,
        naoInformados: resultado.naoInformados.length,
        valorDivergentes: resultado.resultados.filter((r)=>r.status === 'VALOR_DIVERGENTE').reduce((acc, r)=>acc + Math.abs((r.valorInformado ?? 0) - (r.valorSistema ?? 0)), 0),
        valorNaoEncontrados: resultado.resultados.filter((r)=>r.status === 'NAO_ENCONTRADO').reduce((acc, r)=>acc + (r.valorInformado ?? 0), 0),
        valorInvalidos: resultado.resultados.filter((r)=>r.status === 'INVALIDO').reduce((acc, r)=>acc + (r.valorInformado ?? 0), 0),
        valorNaoInformados: resultado.naoInformados.reduce((acc, r)=>acc + (r.valorSistema ?? 0), 0),
        valorTotalLinhas: resultado.resultados.reduce((acc, r)=>acc + (r.valorSistema ?? 0), 0),
        valorOk: resultado.resultados.filter((r)=>r.status === 'OK').reduce((acc, r)=>acc + (r.valorSistema ?? 0), 0),
        total: resultado.resumo.divergentes + resultado.resumo.naoEncontrados + resultado.resumo.invalidos + resultado.naoInformados.length
    } : null;
    const resultadosOrdenados = resultado ? [
        ...resultado.resultados
    ].sort((a, b)=>{
        const linhaDiff = a.linha - b.linha;
        if (linhaDiff !== 0) return linhaDiff;
        return compararIdPatrimonio(a.idPat || '', b.idPat || '');
    }) : [];
    const naoInformadosOrdenados = resultado ? [
        ...resultado.naoInformados
    ].sort((a, b)=>compararIdPatrimonio(a.idPat || '', b.idPat || '')) : [];
    const handleSubmit = async (event)=>{
        event.preventDefault();
        setErro(null);
        setResultado(null);
        if (!centroSelecionado) {
            setErro('Selecione um centro de custo.');
            return;
        }
        if (!arquivo) {
            setErro('Selecione um arquivo Excel.');
            return;
        }
        if (!dataInicioMedicao) {
            setErro('Informe a data de início da medição.');
            return;
        }
        if (!dataFimMedicao) {
            setErro('Informe a data de fim da medição.');
            return;
        }
        if (dataInicioMedicao > dataFimMedicao) {
            setErro('A data de início não pode ser maior que a data de fim da medição.');
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('idCCusto', centroSelecionado);
            formData.append('file', arquivo);
            formData.append('dataInicioMedicao', dataInicioMedicao);
            formData.append('dataFimMedicao', dataFimMedicao);
            const res = await fetch('/api/ccusto/medicao', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) {
                const data = await res.json().catch(()=>({}));
                setErro(data.message || 'Falha ao processar o arquivo.');
                return;
            }
            const data = await res.json();
            const resultadosOrdenados = [
                ...data.resultados || []
            ].sort((a, b)=>{
                const linhaA = Number(a.linha) || 0;
                const linhaB = Number(b.linha) || 0;
                if (linhaA !== linhaB) return linhaA - linhaB;
                return compararIdPatrimonio(a.idPat || '', b.idPat || '');
            });
            setResultado({
                ...data,
                resultados: resultadosOrdenados
            });
        } catch (error) {
            console.error(error);
            setErro('Erro ao processar o arquivo.');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                onKeyDown: handleEnterToNext,
                className: "bg-white rounded-lg shadow-md p-6 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center justify-end gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$MedicaoCCustoForm$2f$ConferirPatrimoniosButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                loading: loading
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 189,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$MedicaoCCustoForm$2f$GerarRelatorioMedicaoButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                resultado: resultado,
                                disabled: loading,
                                codigoCentroCusto: codigoCentroSelecionado,
                                mesBm: mesBm,
                                anoBm: anoBm
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 190,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$components$2f$MedicaoCCustoForm$2f$GerarRelatorioMedicaoPdfButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                resultado: resultado,
                                disabled: loading,
                                codigoCentroCusto: codigoCentroSelecionado,
                                centroCustoLabel: centroSelecionadoLabel,
                                periodoInicioMedicao: dataInicioMedicao,
                                periodoFimMedicao: dataFimMedicao,
                                mesBm: mesBm,
                                anoBm: anoBm
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 197,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                        lineNumber: 188,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium mb-2",
                                children: "Centro de Custo"
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 210,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "w-full border rounded-lg px-3 py-2",
                                value: centroSelecionado,
                                onChange: (e)=>setCentroSelecionado(e.target.value),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Selecione um centro de custo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 216,
                                        columnNumber: 25
                                    }, this),
                                    centros.map((centro)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: centro.idCCusto,
                                            children: (centro.codigoCCusto ? `${centro.codigoCCusto} - ` : '') + (centro.descricaoCCusto || 'Sem descrição')
                                        }, centro.idCCusto, false, {
                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                            lineNumber: 218,
                                            columnNumber: 29
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 211,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                        lineNumber: 209,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium mb-2",
                                children: "Arquivo Excel"
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 227,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: ".xlsx,.xls",
                                onChange: (e)=>setArquivo(e.target.files?.[0] || null),
                                className: "w-full border rounded-lg px-3 py-2"
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 228,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 mt-2",
                                children: [
                                    "A planilha deve ter colunas: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "idPat"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 235,
                                        columnNumber: 54
                                    }, this),
                                    " e ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "valor"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 235,
                                        columnNumber: 79
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 234,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                        lineNumber: 226,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Data Início da Medição"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 241,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: dataInicioMedicao,
                                        onChange: (e)=>setDataInicioMedicao(e.target.value),
                                        className: "w-full border rounded-lg px-3 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 242,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 240,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Data Fim da Medição"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 250,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: dataFimMedicao,
                                        onChange: (e)=>setDataFimMedicao(e.target.value),
                                        className: "w-full border rounded-lg px-3 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 251,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 249,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Mês BM"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 259,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 1,
                                        max: 12,
                                        value: mesBm,
                                        onChange: (e)=>setMesBm(e.target.value),
                                        className: "w-full border rounded-lg px-3 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 260,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 258,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Ano BM"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 270,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 2000,
                                        max: 2099,
                                        value: anoBm,
                                        onChange: (e)=>setAnoBm(e.target.value),
                                        className: "w-full border rounded-lg px-3 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 271,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 269,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                        lineNumber: 239,
                        columnNumber: 17
                    }, this),
                    erro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2",
                        children: erro
                    }, void 0, false, {
                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                        lineNumber: 283,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                lineNumber: 187,
                columnNumber: 13
            }, this),
            resultado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `rounded-lg border p-4 ${(resumoInconsistencias?.total || 0) > 0 ? 'bg-amber border-amber-200' : 'bg-green-50 border-green-200'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-sm",
                                children: "Resumo de inconsistências da importação"
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 295,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm mt-1 text-gray-700",
                                children: (resumoInconsistencias?.total || 0) > 0 ? `Foram encontradas ${resumoInconsistencias?.total} inconsistências no total.` : 'Nenhuma inconsistência encontrada na importação.'
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 296,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded border px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: "Valor divergente"
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 303,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-orange-600",
                                                children: resumoInconsistencias?.divergentes || 0
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 304,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: formatarMoeda(resumoInconsistencias?.valorDivergentes || 0)
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 305,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 302,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded border px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: "Não encontrado"
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 308,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-red-600",
                                                children: resumoInconsistencias?.naoEncontrados || 0
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 309,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: formatarMoeda(resumoInconsistencias?.valorNaoEncontrados || 0)
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 310,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 307,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded border px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: "Linha inválida"
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 313,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-gray-700",
                                                children: resumoInconsistencias?.invalidos || 0
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 314,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: formatarMoeda(resumoInconsistencias?.valorInvalidos || 0)
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 315,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 312,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded border px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: "Não informados no arquivo"
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 318,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-slate-700",
                                                children: resumoInconsistencias?.naoInformados || 0
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 319,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: formatarMoeda(resumoInconsistencias?.valorNaoInformados || 0)
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 320,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 317,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 301,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                        lineNumber: 291,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-5 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow p-4 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: "Total de linhas"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 327,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl font-semibold",
                                        children: resultado.resumo.totalLinhas
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 328,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: formatarMoeda(resumoInconsistencias?.valorTotalLinhas || 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 329,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 326,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow p-4 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: "OK"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 332,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl font-semibold text-green-600",
                                        children: resultado.resumo.ok
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 333,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: formatarMoeda(resumoInconsistencias?.valorOk || 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 334,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 331,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow p-4 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: "Divergentes"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 337,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl font-semibold text-orange-600",
                                        children: resultado.resumo.divergentes
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 338,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: formatarMoeda(resumoInconsistencias?.valorDivergentes || 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 339,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 336,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow p-4 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: "Não encontrados"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 342,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl font-semibold text-red-600",
                                        children: resultado.resumo.naoEncontrados
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 343,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: formatarMoeda(resumoInconsistencias?.valorNaoEncontrados || 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 344,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 341,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow p-4 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: "Inválidos"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 347,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl font-semibold text-gray-600",
                                        children: resultado.resumo.invalidos
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 348,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: formatarMoeda(resumoInconsistencias?.valorInvalidos || 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 349,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 346,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                        lineNumber: 325,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden space-y-3",
                        children: resultadosOrdenados.map((linha)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow p-4 space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-semibold text-gray-900",
                                                        children: [
                                                            "Patrimônio: ",
                                                            linha.idPat || '-'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 358,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: linha.descricaoPat || 'Sem descrição'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 359,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            "Linha: ",
                                                            linha.linha
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 360,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            "Matrícula: ",
                                                            linha.matriculaAlocada || '-'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 361,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            "Funcionário: ",
                                                            linha.nomeFuncionarioAlocado || '-'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 362,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            "Status Patrimônio: ",
                                                            linha.statusPatrimonio || '-'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 357,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-1 rounded-full text-xs font-semibold ${linha.status === 'OK' ? 'bg-green-100 text-green-800' : linha.status === 'VALOR_DIVERGENTE' ? 'bg-orange-100 text-orange-800' : linha.status === 'NAO_ENCONTRADO' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`,
                                                children: linha.mensagem
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 365,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 356,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-2 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-500",
                                                children: "Valor Informado"
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 379,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-800 text-right",
                                                children: formatarMoedaOuTraco(linha.valorInformado)
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 380,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-500",
                                                children: "Valor Sistema"
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 381,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-800 text-right",
                                                children: [
                                                    formatarMoedaOuTraco(linha.valorSistema),
                                                    linha.detalheRateio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-[10px] text-gray-500 mt-1 whitespace-normal text-right",
                                                        children: linha.detalheRateio
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 382,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-500",
                                                children: "Movimentos"
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 390,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-800 text-right",
                                                children: linha.movimentosPatrimonio || '-'
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 391,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 378,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, `${linha.linha}-${linha.idPat}`, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 355,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                        lineNumber: 353,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:block bg-white rounded-lg shadow overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full min-w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "bg-gray-50 border-b",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-sm font-semibold",
                                                    children: "Linha"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-sm font-semibold",
                                                    children: "ID Patrimônio"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                    lineNumber: 403,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-sm font-semibold",
                                                    children: "Matrícula Alocada"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                    lineNumber: 404,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-sm font-semibold",
                                                    children: "Status Patrimônio"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-sm font-semibold",
                                                    children: "Valor Informado"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-sm font-semibold",
                                                    children: "Valor Sistema"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                    lineNumber: 407,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-sm font-semibold",
                                                    children: "Movimentos do Patrimônio"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                    lineNumber: 408,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-sm font-semibold",
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                            lineNumber: 401,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 400,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: resultadosOrdenados.map((linha)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "border-b",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-sm text-[12px]",
                                                        children: linha.linha - 1
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 415,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-sm text-[12px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: linha.idPat || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                                lineNumber: 419,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[10px] text-gray-500 mt-0.5",
                                                                children: linha.descricaoPat || 'Sem descrição'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                                lineNumber: 420,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 418,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-sm text-[12px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: linha.matriculaAlocada || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                                lineNumber: 424,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[10px] text-gray-500 mt-0.5",
                                                                children: linha.nomeFuncionarioAlocado || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                                lineNumber: 425,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 423,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-sm text-[12px]",
                                                        children: linha.statusPatrimonio ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `px-3 py-1 rounded-full text-xs text-[9px] font-semibold 
                                                                ${linha.statusPatrimonio === 'ATIVO' ? 'bg-green-100 text-green-800' : linha.statusPatrimonio === 'DEVOLUÇÃO' ? 'bg-red-100 text-red-800' : linha.statusPatrimonio === 'INATIVO' ? 'bg-orange-100 text-orange-800' : linha.statusPatrimonio === 'MANUTENÇÃO' ? 'bg-gray-100 text-purple-800' : linha.statusPatrimonio === 'TRANSFERIDO' ? 'bg-gray-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`,
                                                            children: linha.statusPatrimonio || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                            lineNumber: 429,
                                                            columnNumber: 53
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-block rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-xs text-[9px] font-semibold",
                                                            children: "SEM STATUS"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                            lineNumber: 442,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-sm text-[12px]",
                                                        children: formatarMoedaOuTraco(linha.valorInformado)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 447,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-sm text-[12px]",
                                                        children: [
                                                            formatarMoedaOuTraco(linha.valorSistema),
                                                            linha.detalheRateio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-[8px] text-gray-500 mt-1",
                                                                children: linha.detalheRateio
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                                lineNumber: 453,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 450,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-sm text-[11px] text-gray-700",
                                                        children: linha.movimentosPatrimonio || '-'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 458,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-sm",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `px-2 py-1 rounded-full text-xs text-[9px] font-semibold 
                                                        ${linha.status === 'OK' ? 'bg-green-100 text-green-800' : linha.status === 'VALOR_DIVERGENTE' ? 'bg-orange-100 text-orange-800' : linha.status === 'NAO_ENCONTRADO' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`,
                                                            children: linha.mensagem
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                            lineNumber: 462,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 461,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, `${linha.linha}-${linha.idPat}`, true, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 414,
                                                columnNumber: 41
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 412,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 399,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                            lineNumber: 398,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                        lineNumber: 397,
                        columnNumber: 21
                    }, this),
                    resultado.naoInformados.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-semibold",
                                        children: "Patrimônios no centro de custo que não vieram no arquivo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 486,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setMostrarNaoInformados((prev)=>!prev),
                                        className: "inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition",
                                        "aria-label": mostrarNaoInformados ? 'Ocultar seção' : 'Visualizar seção',
                                        children: [
                                            mostrarNaoInformados ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 495,
                                                columnNumber: 61
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 495,
                                                columnNumber: 94
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: mostrarNaoInformados ? 'Ocultar' : 'Visualizar'
                                            }, void 0, false, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 496,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                        lineNumber: 489,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 485,
                                columnNumber: 29
                            }, this),
                            mostrarNaoInformados && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "overflow-x-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full min-w-[720px] text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            className: "bg-gray-50 border-b",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-3 py-2 text-left font-semibold",
                                                        children: "ID Patrimônio"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 504,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-3 py-2 text-left font-semibold",
                                                        children: "Descrição"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 505,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-3 py-2 text-left font-semibold",
                                                        children: "Valor Sistema"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 506,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-3 py-2 text-left font-semibold",
                                                        children: "Situação"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 507,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-3 py-2 text-left font-semibold",
                                                        children: "Detalhe"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                        lineNumber: 508,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                lineNumber: 503,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                            lineNumber: 502,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: naoInformadosOrdenados.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "border-b align-top",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-3 py-2 text-[12px]",
                                                            children: item.idPat
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                            lineNumber: 514,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-3 py-2 text-[12px]",
                                                            children: item.descricaoPat || 'Sem descrição'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                            lineNumber: 517,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-3 py-2 text-[12px]",
                                                            children: formatarMoeda(item.valorSistema ?? 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                            lineNumber: 520,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-3 py-2",
                                                            children: item.statusPatrimonio ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `px-3 py-1 rounded-full text-xs text-[9px] font-semibold 
                                                                ${item.statusPatrimonio === 'ATIVO' ? 'bg-green-100 text-green-800' : item.statusPatrimonio === 'DEVOLUÇÃO' ? 'bg-red-100 text-red-800' : item.statusPatrimonio === 'INATIVO' ? 'bg-orange-100 text-orange-800' : item.statusPatrimonio === 'MANUTENÇÃO' ? 'bg-gray-100 text-purple-800' : item.statusPatrimonio === 'TRANSFERIDO' ? 'bg-gray-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`,
                                                                children: item.statusPatrimonio || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                                lineNumber: 525,
                                                                columnNumber: 61
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-block rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-semibold",
                                                                children: "SEM STATUS"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                                lineNumber: 538,
                                                                columnNumber: 61
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                            lineNumber: 523,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-3 py-2 text-xs text-gray-700",
                                                            children: item.detalheDevolucao || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                            lineNumber: 543,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, item.idPat, true, {
                                                    fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 49
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                            lineNumber: 511,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                    lineNumber: 501,
                                    columnNumber: 37
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                                lineNumber: 500,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                        lineNumber: 484,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
                lineNumber: 290,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm.tsx",
        lineNumber: 186,
        columnNumber: 9
    }, this);
}
_s(MedicaoCCustoForm, "MbMM/yruoSwIAbJqVArJ2L+jiJ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$back$2d$end$2f$hooks$2f$useEnterToNext$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEnterToNext"]
    ];
});
_c = MedicaoCCustoForm;
var _c;
__turbopack_context__.k.register(_c, "MedicaoCCustoForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_back-end_61deacb5._.js.map