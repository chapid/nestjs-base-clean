import { CreateUserUseCase } from '../src/modules/users/application/use-cases/create-user.use-case';


describe('CreateUserUseCase', () => {
  it('should create a user successfully', async () => {
    const fakeRepo = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    const fakeImage = {
      getRandomAvatar: jest.fn(),
    };

    fakeRepo.findByEmail.mockResolvedValue(null);
    fakeImage.getRandomAvatar.mockResolvedValue('http://image.com/avatar.png');
    fakeRepo.create.mockImplementation(user => user);

    const useCase = new CreateUserUseCase(
      fakeRepo as any,
      fakeImage as any,
    );

    const result = await useCase.execute('Carlos', 'test@test.com');

    expect(result.email).toBe('test@test.com');
    expect(result.avatar).toBe('http://image.com/avatar.png');
    expect(fakeRepo.create).toHaveBeenCalled();
  });
});