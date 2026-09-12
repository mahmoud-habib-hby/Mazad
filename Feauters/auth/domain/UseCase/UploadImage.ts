
import { IAuthRepository } from "../repo/AuthRepo";



export class UploadImageUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userId: string, file: File) {
    return await this.authRepository.UploadImage(userId, file);
  }
}