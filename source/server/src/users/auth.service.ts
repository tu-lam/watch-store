import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify<string, string, number, Buffer>(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(name: string, email: string, password: string) {
    if (!name) {
      throw new BadRequestException({
        messageCode: 'empty_name_err',
      });
    }

    if (!email) {
      throw new BadRequestException({
        messageCode: 'empty_email_err',
      });
    }

    if (!password) {
      throw new BadRequestException({
        messageCode: 'empty_password_err',
      });
    }

    const isEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isEmailRegex.test(email)) {
      throw new BadRequestException({
        messageCode: 'invalid_email_err',
      });
    }

    // see if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException({
        messageCode: 'existing_email_err',
      });
    }

    // hash the user password
    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash the salt and the password together
    const hash = await scrypt(password, salt, 32);

    // join the hashed result and result together
    const result = salt + '.' + hash.toString('hex');

    // create a new user and save it
    const user = await this.usersService.create(name, email, result);

    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    if (!email) {
      throw new BadRequestException({
        messageCode: 'empty_email_err',
      });
    }

    if (!password) {
      throw new BadRequestException({
        messageCode: 'empty_password_err',
      });
    }

    const isEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isEmailRegex.test(email)) {
      throw new BadRequestException({
        messageCode: 'invalid_email_err',
      });
    }

    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException({ messageCode: 'user_not_found_err' });
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = await scrypt(password, salt, 32);

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException({ messageCode: 'incorrect_password_err' });
    }

    return user;
  }
}
