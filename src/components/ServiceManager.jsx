import React, { useState, useEffect } from 'react';
import { serviceAPI, cityAPI, categoryAPI } from '../services/api';
import { Card, Form, Button, Table, Image, Row, Col, Alert } from 'react-bootstrap';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category_id: '',
    city_id: ''
  });
  const [filters, setFilters] = useState({
    city_id: '',
    category_id: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [servicesRes, citiesRes, categoriesRes] = await Promise.all([
        serviceAPI.getServices(filters.city_id, filters.category_id),
        cityAPI.getCities(),
        categoryAPI.getCategories()
      ]);
      
      setServices(servicesRes.data);
      setCities(citiesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await serviceAPI.createService(newService);
      setNewService({ name: '', description: '', category_id: '', city_id: '' });
      fetchData();
      alert('Serviço criado com sucesso!');
    } catch (error) {
      alert('Erro ao criar serviço: ' + error.message);
    }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!selectedServiceId || !logoFile) {
      alert('Selecione um serviço e um arquivo');
      return;
    }

    try {
      await serviceAPI.uploadLogo(selectedServiceId, logoFile);
      setLogoFile(null);
      setSelectedServiceId('');
      fetchData();
      alert('Logo enviado com sucesso!');
    } catch (error) {
      alert('Erro ao enviar logo: ' + error.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await serviceAPI.deleteService(serviceId);
        fetchData();
        alert('Serviço excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir serviço: ' + error.message);
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2 className="mb-4">Gerenciamento de Serviços</h2>

      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Filtros</Card.Title>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Cidade</Form.Label>
                    <Form.Select
                      value={filters.city_id}
                      onChange={(e) => setFilters({...filters, city_id: e.target.value})}
                    >
                      <option value="">Todas as cidades</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>
                          {city.name} - {city.state}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Categoria</Form.Label>
                    <Form.Select
                      value={filters.category_id}
                      onChange={(e) => setFilters({...filters, category_id: e.target.value})}
                    >
                      <option value="">Todas as categorias</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Criar Novo Serviço</Card.Title>
              <Form onSubmit={handleCreateService}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Serviço</Form.Label>
                  <Form.Control
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    value={newService.category_id}
                    onChange={(e) => setNewService({...newService, category_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Select
                    value={newService.city_id}
                    onChange={(e) => setNewService({...newService, city_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma cidade</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name} - {city.state}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Criar Serviço
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Upload de Logo</Card.Title>
              <Form onSubmit={handleLogoUpload}>
                <Form.Group className="mb-3">
                  <Form.Label>Selecionar Serviço</Form.Label>
                  <Form.Select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    required
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Selecionar Logo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                    required
                  />
                </Form.Group>
                <Button variant="success" type="submit" disabled={!logoFile || !selectedServiceId}>
                  Enviar Logo
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Serviços ({services.length})</Card.Title>
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {services.map(service => (
                  <Card key={service.id} className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col md={3}>
                          {service.logo_url ? (
                            <Image src={service.logo_url} fluid rounded />
                          ) : (
                            <div className="text-muted text-center">Sem logo</div>
                          )}
                        </Col>
                        <Col md={9}>
                          <h5>{service.name}</h5>
                          <p>{service.description}</p>
                          <small className="text-muted">
                            <strong>Cidade:</strong> {service.cities?.name} - {service.cities?.state}<br />
                            <strong>Categoria:</strong> {service.categories?.name}
                          </small>
                          <div className="mt-2">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              Excluir Serviço
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ServiceManager;