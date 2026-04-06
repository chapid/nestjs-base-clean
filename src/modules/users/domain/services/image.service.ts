export abstract class ImageService {
  abstract getRandomAvatar(): Promise<string>;
}