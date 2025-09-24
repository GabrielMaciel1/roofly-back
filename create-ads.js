

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api';

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data.token;
  } catch (error) {
    throw error;
  }
};

const createAdvertisement = async (token, advertisementData) => {
  try {
    const response = await axios.post(`${API_URL}/advertisements`, advertisementData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const main = async () => {
  const token = await login('admin@admin.com', 'admin123');

  const assetsPath = '../roofly-front/assets';
  const houseFolders = fs.readdirSync(assetsPath).filter(file => fs.statSync(path.join(assetsPath, file)).isDirectory() && file.startsWith('casa'));

  const addresses = [
    'Avenida Beira Mar, 1234, Fortaleza, CE',
    'Rua dos Tabajaras, 567, Fortaleza, CE',
    'Avenida Monsenhor Tabosa, 890, Fortaleza, CE',
    'Rua João Cordeiro, 123, Fortaleza, CE',
    'Avenida da Abolição, 456, Fortaleza, CE',
    'Rua Silva Jatahy, 789, Fortaleza, CE',
    'Avenida Santos Dumont, 1011, Fortaleza, CE',
    'Rua Torres Câmara, 1213, Fortaleza, CE',
    'Avenida Padre Antônio Tomás, 1415, Fortaleza, CE',
    'Rua Osvaldo Cruz, 1617, Fortaleza, CE',
    'Rua Barão de Aracati, 200, Fortaleza, CE',
    'Avenida Dom Luís, 500, Fortaleza, CE',
    'Rua Tibúrcio Cavalcante, 1500, Fortaleza, CE',
    'Avenida Washington Soares, 3000, Fortaleza, CE',
    'Rua Leonardo Mota, 100, Fortaleza, CE',
  ];

  const propertyTypes = ['Casa', 'Apartamento'];
  const transactionTypes = ['Venda', 'Aluguel', 'Temporada'];
  const positions = ['Frente', 'Fundos', 'Lateral'];

  for (let i = 0; i < houseFolders.length; i++) {
    const houseFolder = houseFolders[i];
    const houseFolderPath = path.join(assetsPath, houseFolder);
    const imageFiles = fs.readdirSync(houseFolderPath);

    const images = imageFiles.map(imageFile => {
      const imagePath = path.join(houseFolderPath, imageFile);
      return fs.readFileSync(imagePath).toString('base64');
    });

    const title = `Imóvel ${i + 1}: ${getRandomElement(propertyTypes)} em ${getRandomElement(addresses).split(',')[0].trim()}`;
    const description = `Excelente ${getRandomElement(propertyTypes).toLowerCase()} localizado em ${getRandomElement(addresses)}. Possui ${getRandomInt(1, 5)} quartos, ${getRandomInt(1, 4)} banheiros e ${getRandomInt(0, 3)} vagas de garagem. Ideal para ${getRandomElement(['famílias', 'casais', 'investidores'])}.`;
    const price = getRandomInt(100000, 1000000);
    const address = getRandomElement(addresses);
    const propertyType = getRandomElement(propertyTypes);
    const transactionType = getRandomElement(transactionTypes);
    const bedrooms = getRandomInt(1, 5);
    const cep = `60${getRandomInt(0, 9)}${getRandomInt(0, 9)}${getRandomInt(0, 9)}-${getRandomInt(0, 9)}${getRandomInt(0, 9)}${getRandomInt(0, 9)}`;
    const bathrooms = getRandomInt(1, 4);
    const areaM2 = getRandomInt(50, 300);
    const garageSpaces = getRandomInt(0, 3);
    const condominiumFee = getRandomInt(0, 1000);
    const iptu = getRandomInt(0, 5000);
    const furnished = Math.random() > 0.5;
    const petsAllowed = Math.random() > 0.5;
    const financingAccepted = Math.random() > 0.5;
    const floor = getRandomInt(1, 20).toString();
    const elevator = Math.random() > 0.5;
    const position = getRandomElement(positions);
    const showPhoneNumber = Math.random() > 0.5;
    const views = getRandomInt(0, 1000);
    const latitude = -3.71839; // Placeholder for Fortaleza
    const longitude = -38.5434; // Placeholder for Fortaleza

    const advertisementData = {
      title,
      description,
      price,
      address,
      propertyType,
      transactionType,
      bedrooms,
      cep,
      bathrooms,
      areaM2,
      garageSpaces,
      condominiumFee,
      iptu,
      furnished,
      petsAllowed,
      financingAccepted,
      floor,
      elevator,
      position,
      showPhoneNumber,
      views,
      latitude,
      longitude,
      images,
    };

    await createAdvertisement(token, advertisementData);
  }
};

main();

