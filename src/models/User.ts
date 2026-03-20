class User
{
  private readonly id: number;
  private readonly name: string;
  private readonly avatar: string;
  private readonly gender: number;

  get Id(): number {
    return this.id;
  }

  get Name(): string {
    return this.name;
  }

  get Avatar(): string {
    return this.avatar;
  }

  get Gender(): number {
    return this.gender;
  }


  constructor(id: number, name: string, avatar: string, gender: number) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.gender = gender;
  }
}

export default User;
