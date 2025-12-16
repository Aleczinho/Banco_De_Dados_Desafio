import React, { useState, useEffect } from 'react';
import { cityAPI } from '../services/api';
import { Card, Form, Button, Table } from 'react-bootstrap';

const CityManager = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState({ name: '', state: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await cityAPI.getCities();
      setCities(response.data);
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCity = async (e) => {
    e.preventDefault();
    try {
      await cityAPI.createCity(newCity);
      setNewCity({ name: '', state: '' });
      fetchCities();
      alert('Cidade criada com sucesso!');
    } catch (error) {
      alert('Erro ao criar cidade: ' + error.message);
    }
  };

  if (loading) return <div>Carregando cidades...</div>;

  return (
    <div>
      <h2 className="mb-4">Gerenciamento de Cidades</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Criar Nova Cidade</Card.Title>
          <Form onSubmit={handleCreateCity}>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Cidade</Form.Label>
              <Form.Control
                type="text"
                value={newCity.name}
                onChange={(e) => setNewCity({...newCity, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                value={newCity.state}
                onChange={(e) => setNewCity({...newCity, state: e.target.value})}
                required
                maxLength={2}
                placeholder="Ex: SP, RJ, MG"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Criar Cidade
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Lista de Cidades ({cities.length})</Card.Title>
          <Table striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {cities.map(city => (
                <tr key={city.id}>
                  <td>{city.id}</td>
                  <td>{city.name}</td>
                  <td>{city.state}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CityManager;