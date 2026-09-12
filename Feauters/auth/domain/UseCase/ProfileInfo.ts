import { IAuthRepository } from "../repo/AuthRepo";

export class ProfileInfoUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userId: string) {
    return await this.authRepository.ProfileInfo(userId);
  }
}