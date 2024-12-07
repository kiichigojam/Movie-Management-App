// components/Header.tsx
"use client";
import Link from 'next/link';
import React, { useState } from 'react';

function Header() {
  const Menu = [
    {
      id: 1,
      name: "Home",
      path: '/',
    },
    {
      id: 2,
      name: "Movies",
      subMenu: [
        {
          id: 21,
          name: "Add Movies",
          path: '/movies/new', 
        },
        {
          id: 22,
          name: "Manage Movies",
          path: '/movies', 
        },
      ],
    },
    {
      id: 3,
      name: "Filter Movies",
      path: '/filters',
    },
  ];

  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const handleDropdownToggle = (id: number) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const dropdownMenuStyle: React.CSSProperties = {
    width: '200px',
    padding: '0.5rem',
    backgroundColor: 'white',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    position: 'absolute',
    left: '0',
    marginTop: '0.5rem',
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 shadow-lg border-2 rounded-xl bg-white">
      <div className="flex items-center gap-10">
        <ul className="md:flex gap-8 hidden">
          {Menu.map((item) => (
            <li
              key={item.id}
              className="relative group hover:text-primary cursor-pointer hover:scale-105 transition-all ease-in-out"
            >
              {item.subMenu ? (
                <>
                  <span onClick={() => handleDropdownToggle(item.id)}>
                    {item.name}
                  </span>
                  {dropdownOpen === item.id && (
                    <ul style={dropdownMenuStyle}>
                      {item.subMenu.map((subItem) => (
                        <li
                          key={subItem.id}
                          className="hover:bg-gray-200 rounded-lg p-2"
                        >
                          <Link href={subItem.path}>{subItem.name}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link href={item.path}>{item.name}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Header;