import { IAuthRepository } from "../repo/AuthRepo";

export class ChangeEmailUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userId: string, email: string) {
    return await this.authRepository.ChangeEmail(userId, email);
  }
}