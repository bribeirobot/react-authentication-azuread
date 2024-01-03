import React, { useState }from 'react';

import { useAuth } from '../../hooks/auth';

import logo from '../../assets/logo.svg';
import '../../assets/styles.css';

const Dashboard = () => {
  const { signOut, accountInfo } = useAuth();
  const empresas = accountInfo.user.employees;
  const [empresaSelecionada, setEmpresaSelecionada] = useState(empresas[0]);


  return (
    <div>
      <header className="App-header">
        <img src={logo} alt="ReactJS, Azure AD" className="App-logo" />

        <div>
          <p>Bem-vindo,
            <strong> {accountInfo.user.displayName}</strong>
          </p>
          { /* Combobox de empresas */}
          <label htmlFor="">Escolha a empresa: </label>
          <select 
            id="empresas"
            onChange={(e) => {
              const empresaId = parseInt(e.target.value, 2);
              const empresa = empresas.find((emp) => emp.idEmpresa === empresaId);
              setEmpresaSelecionada(empresa || empresas[0]);
            }}
            value={empresaSelecionada.idEmpresa}
          >
            {empresas.map((empresa) => (
              <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                {empresa.nmEmpresa}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="App-button" onClick={signOut}>sair</button>
      </header>
    </div>
  );
};

export default Dashboard;
