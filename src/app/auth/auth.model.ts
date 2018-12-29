export class AuthModel {

  constructor(
    public username: string,
    public password: string,
    public rememberMe?: boolean
  ) {
  }
}
