import { IAuthRepository } from "../repo/AuthRepo";

export class LogoutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute() {
    return await this.authRepository.logout();
  }
}