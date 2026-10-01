export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export const translations = {
  en: {
    // Brand
    appName: 'PromptVault',
    tagline: 'AI Prompt Engineering & Vault',

    // Navigation
    dashboard: 'Dashboard',
    allPrompts: 'All Prompts',
    collections: 'Collections',
    categories: 'Categories',
    library: 'Library',
    favorites: 'Favorites',
    tags: 'Tags',
    settings: 'Settings',

    // Header & Command Palette
    searchPlaceholder: 'Search prompts, tags, or type a command...',
    addPrompt: 'Add Prompt',
    quickSearch: 'Quick Search',
    quickActions: 'Quick Actions',
    jumpTo: 'Jump to',
    noResultsFound: 'No results found',
    navigate: 'Navigate',
    select: 'Select',

    // Categories
    cat_programming: 'Programming',
    cat_writing: 'Writing & Copy',
    cat_imageGen: 'Image Generation',
    cat_videoGen: 'Video Generation',
    cat_uiUx: 'UI/UX & Design',
    cat_research: 'Research & Analysis',
    cat_general: 'General / Other',

    // Stats
    totalPrompts: 'Total Prompts',
    addedThisMonth: 'Added This Month',
    topCategory: 'Top Category',
    recentPrompts: 'Recent Prompts',
    viewAll: 'View All',
    promptsCount: 'prompts',
    promptCountSingle: 'prompt',

    // Actions & Buttons
    copy: 'Copy',
    copied: 'Copied!',
    open: 'Open',
    edit: 'Edit',
    delete: 'Delete',
    duplicate: 'Duplicate',
    fillAndRun: 'Fill & Run',
    aiEnhancer: 'AI Enhancer',
    shareCard: 'Share Card',
    quality: 'Quality Analysis',
    versions: 'Versions',
    cancel: 'Cancel',
    save: 'Save',
    saveChanges: 'Save Changes',
    create: 'Create',
    clearAll: 'Clear All',
    runIn: 'Run in',

    // Modals
    fillVariablesTitle: 'Fill Prompt Variables',
    variablesDetected: 'Variables Detected',
    inputs: 'Inputs',
    livePreview: 'Live Preview',
    copyWithValues: 'Copy with Values',
    resetDefaults: 'Reset to defaults',

    aiEnhancerTitle: 'AI Prompt Enhancer',
    aiEnhancerSubtitle: 'Transform raw prompt into a production-grade engineered prompt',
    selectFramework: 'Select Optimization Framework',
    saveAsNewVersion: 'Save as New Version',
    copyEnhanced: 'Copy Enhanced',
    enhancedVersion: 'Enhanced Version',
    original: 'Original',

    shareCardTitle: 'Shareable Prompt Card',
    shareCardSubtitle: 'Export an eye-catching card ready for social sharing',
    downloadPng: 'Download Card (PNG)',
    copyText: 'Copy Text',
    styleTheme: 'Style Theme',

    // Settings
    profile: 'Profile',
    preferences: 'Preferences',
    appearance: 'Appearance',
    dataManagement: 'Data Management',
    theme: 'Theme',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    systemTheme: 'System',
    language: 'Language',
    exportData: 'Export Library',
    exportJson: 'Export as JSON',
    exportMarkdown: 'Export as Markdown (.md)',
    exportCsv: 'Export as CSV',
    importData: 'Import Data',
    dangerZone: 'Danger Zone',
    clearAllData: 'Clear All Data',

    // Common
    welcomeTitle: 'Welcome to PromptVault',
    welcomeDesc: 'Your personal AI prompt library. Start by adding your first prompt.',
    addFirstPrompt: 'Add Your First Prompt',

    // PWA & Install
    installApp: 'Install App',
    installPromptTitle: 'Install PromptVault',
    installPromptDesc: 'Install on your device for lightning-fast access, offline support, and a native app experience.',
    installNow: 'Install Now',
    dismiss: 'Later',
    iosInstallGuide: 'Tap the Share icon at the bottom of Safari, then choose "Add to Home Screen".',
  },
  ar: {
    // Brand
    appName: 'برومبت فولت',
    tagline: 'مكتبة وهندسة برومبتات الذكاء الاصطناعي',

    // Navigation
    dashboard: 'لوحة التحكم',
    allPrompts: 'جميع البرومبتات',
    collections: 'المجموعات والمشاريع',
    categories: 'التصنيفات',
    library: 'المكتبة',
    favorites: 'المفضلة',
    tags: 'الوسوم',
    settings: 'الإعدادات',

    // Header & Command Palette
    searchPlaceholder: 'ابحث عن البرومبتات، الأوامر، أو الوسوم...',
    addPrompt: 'إضافة برومبت',
    quickSearch: 'بحث سريع',
    quickActions: 'إجراءات سريعة',
    jumpTo: 'الانتقال إلى',
    noResultsFound: 'لم يتم العثور على نتائج',
    navigate: 'تنقل',
    select: 'اختيار',

    // Categories
    cat_programming: 'البرمجة والتطوير',
    cat_writing: 'الكتابة والمحتوى',
    cat_imageGen: 'توليد الصور',
    cat_videoGen: 'توليد الفيديو',
    cat_uiUx: 'واجهات وتجربة المستخدم',
    cat_research: 'البحث والتحليل',
    cat_general: 'عام ومتنوع',

    // Stats
    totalPrompts: 'إجمالي البرومبتات',
    addedThisMonth: 'أُضيفت هذا الشهر',
    topCategory: 'التصنيف الأكثر استخداماً',
    recentPrompts: 'أحدث البرومبتات',
    viewAll: 'عرض الكل',
    promptsCount: 'برومبتات',
    promptCountSingle: 'برومبت',

    // Actions & Buttons
    copy: 'نسخ',
    copied: 'تم النسخ!',
    open: 'فتح',
    edit: 'تعديل',
    delete: 'حذف',
    duplicate: 'تكرار',
    fillAndRun: 'تعبئة وتشغيل',
    aiEnhancer: 'محسّن الذكاء الاصطناعي',
    shareCard: 'مشاركة كبطاقة',
    quality: 'فحص الجودة',
    versions: 'الإصدارات',
    cancel: 'إلغاء',
    save: 'حفظ',
    saveChanges: 'حفظ التغييرات',
    create: 'إنشاء',
    clearAll: 'مسح الكل',
    runIn: 'تشغيل عبر',

    // Modals
    fillVariablesTitle: 'تعبئة متغيرات البرومبت',
    variablesDetected: 'متغيرات تم اكتشافها',
    inputs: 'الحقول',
    livePreview: 'معاينة حية',
    copyWithValues: 'نسخ مع القيم',
    resetDefaults: 'استعادة القيم الافتراضية',

    aiEnhancerTitle: 'محسّن البرومبت الذكي',
    aiEnhancerSubtitle: 'تحويل المسودة البسيطة إلى برومبت هندسي احترافي عالي الدقة',
    selectFramework: 'اختر نموذج التحسين',
    saveAsNewVersion: 'حفظ كإصدار جديد',
    copyEnhanced: 'نسخ البرومبت المحسن',
    enhancedVersion: 'النسخة المحسنة',
    original: 'الأصلية',

    shareCardTitle: 'بطاقة المشاركة المصورة',
    shareCardSubtitle: 'تصدير بطاقة مصممة بجاذبية وجاهزة للمشاركة في شبكات التواصل',
    downloadPng: 'تحميل كصورة (PNG)',
    copyText: 'نسخ النص',
    styleTheme: 'النمط اللوني',

    // Settings
    profile: 'الملف الشخصي',
    preferences: 'التفضيلات',
    appearance: 'المظهر والثيم',
    dataManagement: 'إدارة البيانات',
    theme: 'الثيم',
    lightTheme: 'فاتح (Light)',
    darkTheme: 'داكن (Dark)',
    systemTheme: 'تلقائي (حسب النظام)',
    language: 'اللغة',
    exportData: 'تصدير المكتبة',
    exportJson: 'تصدير بصيغة JSON',
    exportMarkdown: 'تصدير بصيغة Markdown (.md)',
    exportCsv: 'تصدير بصيغة CSV',
    importData: 'استيراد البيانات',
    dangerZone: 'منطقة الخطر',
    clearAllData: 'حذف جميع البيانات',

    // Common
    welcomeTitle: 'مرحبًا بك في برومبت فولت',
    welcomeDesc: 'مكتبتك المتطورة لتنظيم وهندسة برومبتات الذكاء الاصطناعي.',
    addFirstPrompt: 'أضف أول برومبت لك',

    // PWA & Install
    installApp: 'تثبيت التطبيق',
    installPromptTitle: 'تثبيت تطبيق PromptVault',
    installPromptDesc: 'ثبّت التطبيق على جهازك للوصول الفوري، والعمل بدون إنترنت، وتجربة سلسة كتطبيق أصلي.',
    installNow: 'تثبيت الآن',
    dismiss: 'لاحقاً',
    iosInstallGuide: 'اضغط على زر المشاركة أسفل المتصفح، ثم اختر "إضافة إلى الشاشة الرئيسية".',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
