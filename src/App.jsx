import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { healthCheck } from './services/api';
import ErrorBoundary from './ErrorBoundary';

// Importar componentes
import UserManager from './components/UserManager';
import CityManager from './components/CityManager';
import CategoryManager from './components/CategoryManager';
import ServiceManager from './components/ServiceManager';

// Componente Home
function Home() {
  return (
    <div className="text-center">
      <h1 className="mb-4">🚀 Bem-vindo ao Gerenciador API</h1>
      <p className="lead mb-5">Sistema completo para gerenciar Usuários, Cidades, Categorias e Serviços</p>
      
      <Row>
        {[
          { title: '👥 Usuários', desc: 'Gerencie usuários e avatares', path: '/users', color: 'primary' },
          { title: '🏙️ Cidades', desc: 'Gerencie cidades e estados', path: '/cities', color: 'success' },
          { title: '📁 Categorias', desc: 'Gerencie categorias de serviços', path: '/categories', color: 'info' },
          { title: '🛠️ Serviços', desc: 'Gerencie serviços e logos', path: '/services', color: 'warning' }
        ].map((item, idx) => (
          <Col key={idx} md={3} className="mb-4">
            <Card className={`h-100 border-${item.color} shadow-sm`}>
              <Card.Body className="text-center">
                <div className={`display-4 mb-3 text-${item.color}`}>{item.title.split(' ')[0]}</div>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text className="text-muted">{item.desc}</Card.Text>
                <Link to={item.path} className={`btn btn-${item.color} w-100`}>
                  Acessar
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div className="mt-5 pt-4 border-top">
        <h5 className="text-muted">📊 Status do Sistema</h5>
        <p>API conectada ao Elastic Beanstalk com Supabase</p>
        <small className="text-muted">
          Endpoint: http://desafio-backend-env.eba-ye6nwcjq.us-east-1.elasticbeanstalk.com
        </small>
      </div>
    </div>
  );
}

// Componente principal App
function App() {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await healthCheck();
      setApiStatus('online');
    } catch (error) {
      setApiStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow">
          <Container>
            <Navbar.Brand as={Link} to="/" className="fw-bold">
              <span className="me-2">🚀</span>
              API Supabase Manager
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">🏠 Início</Nav.Link>
                <Nav.Link as={Link} to="/users">👥 Usuários</Nav.Link>
                <Nav.Link as={Link} to="/cities">🏙️ Cidades</Nav.Link>
                <Nav.Link as={Link} to="/categories">📁 Categorias</Nav.Link>
                <Nav.Link as={Link} to="/services">🛠️ Serviços</Nav.Link>
              </Nav>
              <Nav>
                <Navbar.Text className="d-flex align-items-center">
                  <span className="me-2">API:</span>
                  {loading ? (
                    <Spinner animation="border" size="sm" className="text-light" />
                  ) : apiStatus === 'online' ? (
                    <span className="text-success fw-bold">
                      <span className="me-1">●</span> Online
                    </span>
                  ) : (
                    <span className="text-danger fw-bold">
                      <span className="me-1">●</span> Offline
                    </span>
                  )}
                </Navbar.Text>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Conteúdo principal */}
        <Container className="mb-5">
          {apiStatus === 'offline' && (
            <Alert variant="danger" className="shadow-sm">
              <Alert.Heading>⚠️ API Offline</Alert.Heading>
              <p>
                A API parece estar offline. Verifique se o servidor está rodando em:
                <br />
                <strong>http://desafio-backend-env.eba-ye6nwcjq.us-east-1.elasticbeanstalk.com</strong>
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button variant="outline-danger" onClick={checkApiHealth}>
                  Tentar Reconexão
                </Button>
              </div>
            </Alert>
          )}

          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<UserManager />} />
              <Route path="/cities" element={<CityManager />} />
              <Route path="/categories" element={<CategoryManager />} />
              <Route path="/services" element={<ServiceManager />} />
            </Routes>
          </ErrorBoundary>
        </Container>

        {/* Footer */}
        <footer className="mt-auto py-4 bg-dark text-white">
          <Container className="text-center">
            <p className="mb-2 fw-bold">🚀 Frontend para API FastAPI + Supabase</p>
            <small className="text-light">
              Hospedado no Elastic Beanstalk | Conectado a: 
              <span className="text-info ms-1">
                http://desafio-backend-env.eba-ye6nwcjq.us-east-1.elasticbeanstalk.com
              </span>
            </small>
            <div className="mt-3">
              <small className="text-muted">
                © {new Date().getFullYear()} - Sistema de Gerenciamento Completo
              </small>
            </div>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

// Componente Button (para o Alert)
function Button({ variant, onClick, children }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default App;