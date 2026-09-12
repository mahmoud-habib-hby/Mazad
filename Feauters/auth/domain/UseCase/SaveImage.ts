
import { IAuthRepository } from "../repo/AuthRepo";



export class SaveImageUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userId: string, imageUrl: string) {
    return await this.authRepository.SaveImage(userId, imageUrl);
  }
}