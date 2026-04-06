import { ImageService } from '../../domain/services/image.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

/**
 * Esto puede cambiar mañana por otra API sin tocar nada más
 */
@Injectable()
export class RickMortyService implements ImageService {
  constructor(private http: HttpService) {}

  async getRandomAvatar(): Promise<string> {
    const random = Math.floor(Math.random() * 100) + 1;

    const response = await firstValueFrom(
      this.http.get(`https://rickandmortyapi.com/api/character/${random}`)
    );

    return response.data.image;
  }
}