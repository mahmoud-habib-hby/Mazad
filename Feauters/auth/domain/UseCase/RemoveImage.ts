import { IAuthRepository } from "../repo/AuthRepo";

export class RemoveImageUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userId: string, imageUrl: string) {
    return await this.authRepository.RemoveImage(userId, imageUrl);
  }
}