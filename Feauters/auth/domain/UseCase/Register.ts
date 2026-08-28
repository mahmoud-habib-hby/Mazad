import { RegisterData } from "../entity/Register";
import { IAuthRepository } from "../repo/AuthRepo";



export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterData) {
    return await this.authRepository.register(data);
  }
}