import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineAnnotation,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog
  } from 'react-icons/hi';
  
  export const DASHBOARD_SIDEBAR_LINKS = [
    {
      key: 'Colleges',
      label: 'Colleges',
      path: '/dashboard',
      icon: <HiOutlineViewGrid />
    },
    {
      key: 'Add Colleges',
      label: 'Add Colleges',
      path: '/addcollege',
      icon: <HiOutlineViewGrid />
    },
    {
      key: 'Add Courses',
      label: 'Add Courses',
      path: '/addcourse',
      icon: <HiOutlineViewGrid />
    },
    {
      key: 'Add University',
      label: 'Add University',
      path: '/adduniversity',
      icon: <HiOutlineViewGrid />
    },
    
    {
      key: 'All Course',
      label: 'All Course',
      path: '/allcourse',
      icon: <HiOutlineViewGrid />
    },
    {
      key: 'University',
      label: 'University',
      path: '/university',
      icon: <HiOutlineViewGrid />
    },
    {
      key: 'Section',
      label: 'Section',
      path: '/addsection',
      icon: <HiOutlineViewGrid />
    },
    // {
    //   key: 'Add Facility',
    //   label: 'Add facility',
    //   path: '/addfacility',
    //   icon: <HiOutlineViewGrid />
    // },
    // {
    //   key: 'customers',
    //   label: 'Customers',
    //   path: '/customers',
    //   icon: <HiOutlineUsers />
    // },
    // {
    //   key: 'transactions',
    //   label: 'Transactions',
    //   path: '/transactions',
    //   icon: <HiOutlineDocumentText />
    // },
    // {
    //   key: 'messages',
    //   label: 'Messages',
    //   path: '/messages',
    //   icon: <HiOutlineAnnotation />
    // }
  ];
  export const DASHBOARD_SIDEBAR_BOTTOM_LINKS=[
    {
        key: 'settings',
        label: 'Settings',
        path: '/dashboard',
        icon: <HiOutlineCog />
      },
      {
        key: 'support',
        label: 'Help & Support',
        path: '/dashboard',
        icon: <HiOutlineQuestionMarkCircle />  
      }
  ]