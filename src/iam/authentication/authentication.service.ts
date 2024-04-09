import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly userService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const isUserExist = await this.userService.getUserByEmail(signUpDto.email);
    if (isUserExist)
      throw new BadRequestException(
        `This user by email(${signUpDto.email}) is already exist`,
      );

    const hashedPassword = await this.hashingService.hash(signUpDto.password);

    return this.userService.createUser({
      name: signUpDto.name,
      email: signUpDto.email,
      password: hashedPassword,
    });
  }
  async signIn(signInDto: SignInDto) {
    const errorMsg = 'This email and password combination is not valid';

    const user = await this.userService.getUserByEmail(signInDto.email);
    if (!user) throw new NotFoundException(errorMsg);

    const isPasswordValid = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) throw new BadRequestException(errorMsg);

    // TODO: add JWT token

    return {
      accessToken: '',
      refreshToken: '',
    };
  }
}
