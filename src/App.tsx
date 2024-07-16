import { useState } from 'react';
import './styles/global.css';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from './lib/supabase';
import { Form } from './components/Form';

const createUserFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .optional()
    .refine((list) => {
      if (!list || list.length === 0) return false; // Avatar não pode ser vazio
      const file = list.item(0);
      return file && file.size <= 5 * 1024 * 1024; // Verifica o tamanho do arquivo
    }, {
      message: 'Por favor, selecione um arquivo de imagem com até 5MB'
    }),
  name: z.string().min(1, 'O nome é obrigatório')
    .transform(name => {
      return name.trim()
        .split(' ')
        .map(word => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        }).join(' ')
    }),
  email: z.string()
    .min(1, 'O email é obrigatório')
    .email('Formato de email inválido')
    .toLowerCase()
    .refine(email => {
      return email.endsWith('@gmail.com')
    }, 'O email precisa ser do Gmail'),
  password: z.string()
    .min(6, "A senha precisa de no mínimo 6 caracteres"),
  techs: z.array(z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    knowledge: z.coerce.number().min(1).max(100),
  })).min(1, 'Insira pelo menos 2 tecnologias'),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState('');
  const methods = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  });
  const { handleSubmit, control, formState: { errors } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  });

  function addNewTech() {
    append({ title: '', knowledge: 0 });
  }

  async function createUser(data: CreateUserFormData) {
    try {
      if (!data.avatar) {
        throw new Error('Avatar é obrigatório');
      }
      await supabase.storage.from("form-react").upload(data.avatar.name, data.avatar);
      setOutput(JSON.stringify(data, null, 2));
    } catch (error) {
      if (error instanceof Error) {
        setOutput(error.message);
      }
    }
  }

  return (
    <div>
      <main className="h-screen bg-zinc-900 text-zinc-200 flex flex-col items-center justify-center gap-10">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(createUser)} className='flex flex-col gap-4 w-full max-w-xs'>

            <Form.Field>
              <Form.Label htmlFor="avatar">Avatar</Form.Label>
              <Form.Input name="avatar" type="file" />
              <Form.ErrorMessage name="avatar" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="name">Nome</Form.Label>
              <Form.Input name="name" type="text" />
              <Form.ErrorMessage name="name" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="email">E-mail</Form.Label>
              <Form.Input name="email" type="email" />
              <Form.ErrorMessage name="email" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="password">Senha</Form.Label>
              <Form.Input name="password" type="password" />
              <Form.ErrorMessage name="password" />
            </Form.Field>

            <div className='flex flex-col gap-1'>
              <label htmlFor="" className='flex items-center justify-between'>
                Tecnologias
                <button type='button' onClick={addNewTech} className='text-emerald-500 text-sm'>Adicionar</button>
              </label>
              {fields.map((field, index) => (
                <Form.Field key={field.id}>
                  <Form.Label htmlFor={`techs.${index}.title`}>Título {index + 1}</Form.Label>
                  <Form.Input name={`techs.${index}.title`} type="text" />
                  <Form.ErrorMessage name={`techs.${index}.title`} />
                  <Form.Label htmlFor={`techs.${index}.knowledge`}>Conhecimento {index + 1}</Form.Label>
                  <Form.Input name={`techs.${index}.knowledge`} type="number" />
                  <Form.ErrorMessage name={`techs.${index}.knowledge`} />
                  <button type="button" onClick={() => remove(index)} className='text-red-500'>Remover</button>
                </Form.Field>
              ))}
              {errors.techs && <span className='text-red-500 text-sm'>{errors.techs.message}</span>}
            </div>

            <button type="submit" className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600'>
              Salvar
            </button>
          </form>
        </FormProvider>

        <pre>{output}</pre>
      </main>
    </div>
  );
}

export default App;
