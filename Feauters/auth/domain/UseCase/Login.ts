import { LoginData } from "../entity/Login";
import { IAuthRepository } from "../repo/AuthRepo";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data:LoginData) {
    return await this.authRepository.login(data);
  }
}