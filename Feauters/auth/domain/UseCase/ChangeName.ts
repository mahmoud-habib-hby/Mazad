import { IAuthRepository } from "../repo/AuthRepo";

export class ChangeNameUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userId: string, name: string) {
    return await this.authRepository.ChangeName(userId, name);
  }
}