# Mr.UseCase

![Node.js CI Tests](https://github.com/IlyaDonskikh/mr-use-case/actions/workflows/node.js.yml/badge.svg?branch=master)

The perfect way to wrap your business logic fast and properly.

<img width="200" alt="Mr.UseCase" src="https://user-images.githubusercontent.com/3100222/118412068-9bcf2a80-b6a0-11eb-8977-98c66c165052.png">

## Introduction

> These use cases orchestrate the flow of data to and from the entities, and direct those entities to use their Critical Business Rules to achieve the goals of the use case.

[📖 Clean Architecture book](http://www.plainionist.net/Clean-Architecture/)

The UseCase layer allows you to achieve significant benefits in the following parts of writing code:

- Make development process clear for all participants
- Speed up the development of production-ready projects
- Avoid complexity
- Reduce coupling

So, developers and use cases have to be friends🤝 forever at least for reasons outlined above.

## Installation

Just one step.

```shell
npm i mr-use-case
```

And use it where you need it.

```typescript
import { MrUseCase } from 'mr-use-case';
```

#### Localization

As well you have an option to localize errors through error builder customization:

```typescript
import { MrUseCase } from 'mr-use-case';
import { ErrorsBuilder } from './errors.builder';

export function UseCase<T, R>() {
  return MrUseCase<T, R>({ errorsBuilder: ErrorsBuilder });
}
```

Read more about it on [🥞 Mr.Error page](https://github.com/IlyaDonskikh/mr-error).

## Overview

This section contains a simple use case that shows us an example of `Mr.UseCase` implementation. Let's take a quick look at the following piece of code:

```typescript
import { MrUseCase } from 'mr-use-case';
import { User } from '$path';
import { isEmail } from '$path';

interface Request {
  email: string;
}

interface Response {
  user: User;
}

export class UserCreateCase extends MrUseCase<Request, Response>() {
  private position?: UserPosition;
  private positionValidated: UserPosition;

  // process

  async process() {
    await this.assignVariables();

    await this.validate(); // calls checks()

    const user = await User.create({
      email: this.request.email,
      positionId: this.positionValidated.id,
    });

    return { user };
  }

  // private

  protected async checks() {
    if (!this.request.email) {
      this.errors.add('email', 'presence');
    }

    if (!isEmail(this.request.email)) {
      this.errors.add('email', 'format');
    }

    if (!this.position) {
      this.errors.add('email', 'positionFind');

      return;
    }

    this.positionValidated = this.position;
  }

  private async assignVariables() {
    this.position = await findAvailablePosition();
  }

  private async findAvailablePosition() {
    // ...
  }
}
```

As you can see, the code is split into four parts:

1. Assigning a variable area
2. Validation
3. Execution
4. Packing response

Keep in mind that one use case must fullfil only one business purpose and give a straight answer about the success of the operation after the call.

Now let's see how we may use it in the positive scenario:

```typescript
const email = 'example@example.com';
const { user } = await UserCreateCase.call({ email });

return user; // => created user
```

However, what happens if the passed value is not an email? Let's change our code and see.

```typescript
const email = 'wrongemail';

try {
  const { user } = await UserCreateCase.call({ email });
} catch (err) {
  if (err instanceof MrError) {
    debug(err.errors.messages());

    return;
  }

  throw err;
}
```

In this scenario our use case throws an exception containing all errors that were caught by the validation process. You may read more about the errors format at [🥞 Mr.Error page](https://github.com/IlyaDonskikh/mr-error).

Let's make a conclusion.

> ⚠️ At this moment you probably would like to see an integration of the module to something more ready to use. And specifically for this purpose [🐨 Mr.Koa boilerplate](https://github.com/IlyaDonskikh/mrkoa) exists.

## Conclusion

The use cases make your work much simpler, more structured and efficient. And `Mr.UseCase` pleasantly provides an interface to enjoy these advantages with no headache.

Give it a try!
