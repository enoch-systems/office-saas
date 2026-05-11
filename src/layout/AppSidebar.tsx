"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { Modal } from "@/components/ui/modal";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
} from "../icons/index";
import { Users, Mail, User, CreditCard, ShieldAlert, Trash2 } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    icon?: React.ReactNode;
    requiresConfirmation?: boolean;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Students Management",
    subItems: [
      { name: "Student Database", path: "/", pro: false, icon: <Users className="w-5 h-5" /> },
      { name: "Email Follow up portal", path: "/email-portal", pro: false, icon: <Mail className="w-5 h-5" /> },
      { name: "Payment Checker", path: "/email-portal/payment-checker", pro: false, icon: <CreditCard className="w-5 h-5" /> },
      { name: "Student Management", path: "/student-management", pro: false, icon: <Trash2 className="w-5 h-5" />, requiresConfirmation: true },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <User className="w-5 h-5" />,
    name: "User Profile",
    path: "/profile",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [showSensitiveRouteModal, setShowSensitiveRouteModal] = useState(false);
  const [pendingNavigationPath, setPendingNavigationPath] = useState<string | null>(null);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
                onClick={() => {
                  // Close mobile sidebar when navigation item is clicked
                  if (window.innerWidth < 768) {
                    toggleMobileSidebar();
                  }
                }}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                      onClick={(event) => {
                        if (subItem.requiresConfirmation) {
                          event.preventDefault();
                          handleSensitiveNavigation(subItem.path);
                          return;
                        }

                        // Close mobile sidebar when navigation item is clicked
                        if (window.innerWidth < 768) {
                          toggleMobileSidebar();
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {subItem.icon && (
                          <span className="flex-shrink-0">
                            {subItem.icon}
                          </span>
                        )}
                        <span>{subItem.name}</span>
                      </div>
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSensitiveNavigation = (path: string) => {
    setPendingNavigationPath(path);
    setShowSensitiveRouteModal(true);
  };

  const proceedToSensitiveRoute = () => {
    if (!pendingNavigationPath) {
      return;
    }

    router.push(pendingNavigationPath);
    setShowSensitiveRouteModal(false);
    setPendingNavigationPath(null);

    if (window.innerWidth < 768) {
      toggleMobileSidebar();
    }
  };

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
            }
          });
        }
      });
    });
  }, [pathname,isActive]);

  const prevPathnameRef = useRef(pathname);
  
  useEffect(() => {
    // Only check submenu match when pathname changes
    if (prevPathnameRef.current !== pathname) {
      // Check if current pathname matches any submenu item
      const isSubmenuItemMatched = () => {
        const checkItems = (items: NavItem[]) => {
          return items.some((item: NavItem) => {
            if (item.subItems) {
              return item.subItems.some((subItem) => pathname === subItem.path);
            }
            return false;
          });
        };
        
        return checkItems(navItems) || checkItems(othersItems);
      };

      if (!isSubmenuItemMatched() && openSubmenu !== null) {
        setTimeout(() => setOpenSubmenu(null), 0);
      }
      prevPathnameRef.current = pathname;
    }
  }, [pathname, openSubmenu]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <>
      <aside
        className={`fixed mt-26 sm:mt-20 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
          ${
            isExpanded || isMobileOpen
              ? "w-[290px]"
              : isHovered
              ? "w-[290px]"
              : "w-[90px]"
          }
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {user && (
          <>
          <div
            className={`py-8 flex  ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            <Link href="/">
              {isExpanded || isHovered || isMobileOpen ? (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                    <span className="text-white font-bold text-lg">TT</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Academy</span>
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-white font-bold text-sm">TT</span>
                </div>
              )}
            </Link>
          </div>
          <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
            <nav className="mb-6">
              <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {othersItems.length > 0 && (
              <div className="">
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Others"
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(othersItems, "others")}
              </div>
            )}
          </div>
        </nav>
      </div>
          </>
        )}
      </aside>
      <Modal
        isOpen={showSensitiveRouteModal}
        onClose={() => {
          setShowSensitiveRouteModal(false);
          setPendingNavigationPath(null);
        }}
        className="mx-4 max-w-xl p-0"
      >
        <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white text-center shadow-[0_30px_120px_rgba(15,23,42,0.22)] dark:border-gray-800 dark:bg-gray-900">
          <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.32),_transparent_72%)]" />
          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-red-500 text-white shadow-lg shadow-amber-200/70 dark:shadow-none">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-amber-600 dark:text-amber-300">
              Sensitive Area
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-[30px]">
              Student Management Warning
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-600 dark:text-gray-300 sm:text-base">
              This section contains sensitive student records. Any wrong action can
              permanently remove important data. Please proceed only if you are
              sure.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={proceedToSensitiveRoute}
                className="inline-flex min-w-[170px] items-center justify-center rounded-2xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Yes, Proceed
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSensitiveRouteModal(false);
                  setPendingNavigationPath(null);
                }}
                className="inline-flex min-w-[170px] items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AppSidebar;
