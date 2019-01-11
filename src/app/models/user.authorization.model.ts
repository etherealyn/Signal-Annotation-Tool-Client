

export class UserAuthorization {

  constructor(
    public username: string,
    public password: string,
    public rememberMe?: boolean
  ) {
  }
}
