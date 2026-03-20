class User
{
  private readonly id: number;
  private readonly name: string;
  private readonly avatar: string;


  get Id(): number {
    return this.id;
  }

  get Name(): string {
    return this.name;
  }

  get Avatar(): string {
    return this.avatar;
  }

  constructor(id: number, name: string, avatar: string) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
  }
}

export default User;
