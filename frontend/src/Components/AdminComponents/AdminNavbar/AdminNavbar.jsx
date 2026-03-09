import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Code, Text } from '@mantine/core';
import './AdminNavbar.css';

import AddProduct from '../AddProduct/AddProduct';
import ProductList from '../ProductList/ProductList';
import BulkUpload from '../../BulkUpload';

const data = [
  { label: 'Products', component: <ProductList /> },
  { label: 'Add Product', component: <AddProduct /> },
  { label: 'Add product bulk', component: <BulkUpload /> },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('Products');

  const activeComponent = data.find(item => item.label === active)?.component;

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="admin-navbarMain">
          <Group className="admin-header" justify="space-between">
            <Text className='admin-header-name' onClick={() => navigate("/")}>
                Urban
            </Text>
          </Group>

          {data.map((item) => (
            <button
              key={item.label}
              className={`admin-link ${active === item.label ? 'admin-active' : ''}`}
              onClick={() => setActive(item.label)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="admin-content">
        {activeComponent}
      </div>
    </div>
  );
}

export default AdminNavbar;