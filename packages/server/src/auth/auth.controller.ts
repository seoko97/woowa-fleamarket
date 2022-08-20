import { Response } from 'express';
import {
  BadRequestException,
  Controller,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenUser, User } from '@src/decorator/user.decorator';
import { UserService } from '@src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  AccessJwtAuthGuard,
  RefreshJwtAuthGuard,
} from './guards/jwt-auth.guard';

// 상수 (7일)
// 분리하면 좋을 것 같습니다.
const EXPIRED_ACCESS_TOKEN = 1000 * 60 * 5;
const EXPIRED_REFRESH_TOKEN = 1000 * 60 * 60 * 24 * 14;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @User() _user: TokenUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.getUserById(_user.id);

    if (!user) {
      throw new BadRequestException('존재하지 않는 유저입니다.');
    }

    const [accessToken, refreshToken] = await this.authService.login(_user.id);
    const config = this.configService;

    res.cookie(config.get('JWT_ACCESS_TOKEN'), accessToken, {
      httpOnly: true,
      maxAge: EXPIRED_ACCESS_TOKEN,
    });

    res.cookie(config.get('JWT_REFRESH_TOKEN'), refreshToken, {
      httpOnly: true,
      maxAge: EXPIRED_REFRESH_TOKEN,
    });

    return { user };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('/logout')
  async logout(
    @User() _user: TokenUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.updateRefreshToken(_user.id, null);

    const config = this.configService;

    res.clearCookie(config.get('JWT_ACCESS_TOKEN'));
    res.clearCookie(config.get('JWT_REFRESH_TOKEN'));

    return;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('/refresh')
  async refresh(
    @User() _user: TokenUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const [accessToken, refreshToken] = await this.authService.login(_user.id);
    const config = this.configService;

    res.cookie(config.get('JWT_ACCESS_TOKEN'), accessToken, {
      httpOnly: true,
      maxAge: EXPIRED_ACCESS_TOKEN,
    });

    res.cookie(config.get('JWT_REFRESH_TOKEN'), refreshToken, {
      httpOnly: true,
      maxAge: EXPIRED_REFRESH_TOKEN,
    });

    return true;
  }
}
