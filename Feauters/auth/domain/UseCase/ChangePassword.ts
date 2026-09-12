import { IAuthRepository } from "../repo/AuthRepo";

export class ChangePasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userId: string, password: string, ) {
    return await this.authRepository.ChangePassword(userId, password);
  }
}