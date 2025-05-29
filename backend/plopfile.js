export default function (plop) {
  const prompt = [
    {
      type: 'input',
      name: 'name',
      message: 'モジュール名を入力してください（例: post）:',
    },
  ];

  const generators = [
    {
      name: 'module',
      description: 'NestJS Module を生成',
      path: 'src/{{kebabCase name}}/{{kebabCase name}}.module.ts',
      template: 'plop-templates/module/module.hbs',
    },
    {
      name: 'controller',
      description: 'Controller を生成',
      path: 'src/{{kebabCase name}}/controller/{{kebabCase name}}.controller.ts',
      template: 'plop-templates/controller/controller.hbs',
    },
    {
      name: 'create-dto',
      description: 'Create DTO を生成',
      path: 'src/{{kebabCase name}}/dto/create_{{kebabCase name}}.dto.ts',
      template: 'plop-templates/dto/create-dto.hbs',
    },
    {
      name: 'update-dto',
      description: 'Update DTO を生成',
      path: 'src/{{kebabCase name}}/dto/update_{{kebabCase name}}.dto.ts',
      template: 'plop-templates/dto/update-dto.hbs',
    },
    {
      name: 'response-dto',
      description: 'Response DTO を生成',
      path: 'src/{{kebabCase name}}/dto/{{kebabCase name}}_response.dto.ts',
      template: 'plop-templates/dto/response-dto.hbs',
    },
    {
      name: 'entity',
      description: 'Entity を生成',
      path: 'src/{{kebabCase name}}/entity/{{kebabCase name}}.entity.ts',
      template: 'plop-templates/entity/entity.hbs',
    },
    {
      name: 'guard',
      description: 'Owner Guard を生成',
      path: 'src/{{kebabCase name}}/guard/{{kebabCase name}}-owner.guard.ts',
      template: 'plop-templates/guard/owner.guard.hbs',
    },
    {
      name: 'mapper',
      description: 'Mapper を生成',
      path: 'src/{{kebabCase name}}/mapper/{{kebabCase name}}.mapper.ts',
      template: 'plop-templates/mapper/mapper.hbs',
    },
    {
      name: 'repository',
      description: 'Repository interface を生成',
      path: 'src/{{kebabCase name}}/repository/{{kebabCase name}}.repository.ts',
      template: 'plop-templates/repository/repository.hbs',
    },
    {
      name: 'prisma-repository',
      description: 'Prisma Repository を生成',
      path: 'src/{{kebabCase name}}/repository/prisma-{{kebabCase name}}.repository.ts',
      template: 'plop-templates/repository/prisma-repository.hbs',
    },
    {
      name: 'create-use-case',
      description: 'Create UseCase を生成',
      path: 'src/{{kebabCase name}}/use-case/create-{{kebabCase name}}.use-case.ts',
      template: 'plop-templates/use-case/create-use-case.hbs',
    },
    {
      name: 'delete-use-case',
      description: 'Delete UseCase を生成',
      path: 'src/{{kebabCase name}}/use-case/delete-{{kebabCase name}}.use-case.ts',
      template: 'plop-templates/use-case/delete-use-case.hbs',
    },
    {
      name: 'find-all-use-case',
      description: 'Find All UseCase を生成',
      path: 'src/{{kebabCase name}}/use-case/find-all-{{kebabCase name}}s.use-case.ts',
      template: 'plop-templates/use-case/find-all-use-case.hbs',
    },
    {
      name: 'find-by-id-use-case',
      description: 'Find by ID UseCase を生成',
      path: 'src/{{kebabCase name}}/use-case/find-{{kebabCase name}}-by-id.use-case.ts',
      template: 'plop-templates/use-case/find-by-id-use-case.hbs',
    },
    {
      name: 'update-use-case',
      description: 'Update UseCase を生成',
      path: 'src/{{kebabCase name}}/use-case/update-{{kebabCase name}}.use-case.ts',
      template: 'plop-templates/use-case/update-use-case.hbs',
    },
  ];

  // ✅ 個別ジェネレータ登録
  generators.forEach((g) => {
    plop.setGenerator(g.name, {
      description: g.description,
      prompts: prompt,
      actions: [
        {
          type: 'add',
          path: g.path,
          templateFile: g.template,
        },
      ],
    });
  });

  // ✅ 一括生成ジェネレータ
  plop.setGenerator('all', {
    description: 'すべての構成ファイルをまとめて生成',
    prompts: prompt,
    actions: generators.map((g) => ({
      type: 'add',
      path: g.path,
      templateFile: g.template,
    })),
  });
}
