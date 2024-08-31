import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';

import sharp from 'sharp';
import path from 'path';

import { GEMINI_API_KEY, GEMINI_API_URL} from '../config/gemini';
import MeasurementRepository from '../repositories/measurementRepository';
import { MeasurementDto } from '../dtos/measurementDto';
import Measurement from '../models/measurement';
import { GoogleGenerativeAI } from '@google/generative-ai';

class MeasurementService {
  async createMeasurement(measurementData: MeasurementDto): Promise<Measurement> {
    return MeasurementRepository.create(measurementData);
  }

  async getMeasurementById(id: string): Promise<Measurement | null> {
    return MeasurementRepository.findById(id);
  }

  async getMeasurementFromImage(imageBase64: string): Promise<number> {
    const genAi = new GoogleGenerativeAI(GEMINI_API_KEY!);

    const model = genAi.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const imageBuffer = Buffer.from(imageBase64, 'base64');
  
    try {
      // Replace generateText with the correct method
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: "image/jpeg",
            fileUri: Buffer.from(imageBase64).toString('base64')
          }
        },
        { text: "What is the number in clock meditor?" },
      ]);
  
      if (result.response && result.response.text()) {
        const matched = result.response.text().match(/\d+/);
        if (matched) {
          return parseInt(matched[0], 10); // Convert to an integer
        } else {
          throw new Error('Nenhum valor numérico encontrado na resposta.');
        }
      } else {
        throw new Error('Resposta inválida da API Gemini.');
      }
    } catch (error) {
      console.error('Erro ao processar a imagem:', error);
      throw new Error('Erro ao processar a imagem.');
    }
  }
  
  async saveBase64Image(imageBase64: string, fileName: string): Promise<string> {

    const matches = imageBase64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error('String base64 inváida');
    }

    const fileType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    // Validação do tipo de imagem
    const allowedTypes = ['png', 'jpeg', 'webp', 'heic', 'heif'];
    if (!allowedTypes.includes(fileType.toLowerCase())) {
      throw new Error('Tipo de imagem não suportado');
    }

    // Diretório de uploads
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

    // Cria o diretório de uploads se não existir
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Sanitização básica do nome do arquivo para evitar caracteres inválidos
    const sanitizedFileName = fileName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();

    const filePath = path.join(uploadsDir, `${sanitizedFileName}.${fileType}`);

    // Escreve o arquivo no sistema de arquivos
    await writeFile(filePath, buffer);

    // Retorna o caminho relativo para uso no banco de dados
    const relativeFilePath = path.relative(path.join(__dirname, '..', '..'), filePath).replace(/\\/g, '/'); // Para compatibilidade com URLs

    return relativeFilePath;
  }
  // Adicione lógica adicional conforme necessário
}

export default new MeasurementService();