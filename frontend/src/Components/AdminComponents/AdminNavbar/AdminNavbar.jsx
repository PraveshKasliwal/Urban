import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Code, Text } from '@mantine/core';
import './AdminNavbar.css';

import AddProduct from '../AddProduct/AddProduct';
import ProductList from '../ProductList/ProductList';
import EditProduct from '../EditProduct/EditProduct';
import BulkUpload from '../../BulkUpload';

const Databases = () => <h2>Databases Page</h2>;
const Authentication = () => <h2>Authentication Page</h2>;
const OtherSettings = () => <h2>Other Settings Page</h2>;

const data = [
  { label: 'Products', component: <ProductList /> },
  { label: 'Add Product', component: <AddProduct /> },
  { label: 'Add product bulk', component: <BulkUpload /> },
  { label: 'Databases', component: <Databases /> },
  { label: 'Authentication', component: <Authentication /> },
  { label: 'Other Settings', component: <OtherSettings /> },
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

        <div className="admin-footer">
          <button className="admin-link">Change account</button>
          <button className="admin-link">Logout</button>
        </div>
      </nav>

      <div className="admin-content">
        {activeComponent}
      </div>
    </div>
  );
}

export default AdminNavbar;