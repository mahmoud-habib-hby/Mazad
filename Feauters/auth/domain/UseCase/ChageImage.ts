import { IAuthRepository } from "../repo/AuthRepo";

export class ChangeImageUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userId: string, image: string) {
    return await this.authRepository.ChangeImage(userId, image);
  }
}