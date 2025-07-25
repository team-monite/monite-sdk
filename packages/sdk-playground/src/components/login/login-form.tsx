import { useForm } from 'react-hook-form';

import { getLoginEnvData, setLoginEnvData } from '@/services/login-env-data';
import { zodResolver } from '@hookform/resolvers/zod';

import z from 'zod';

import { Button } from '../ui/button';
import { Form, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  entityId: z.string().optional(),
  entityUserId: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
});

export function LoginForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}) {
  const storedValues = getLoginEnvData(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entityId: storedValues.entityId ?? '',
      entityUserId: storedValues.entityUserId ?? '',
      clientId: storedValues.clientId ?? '',
      clientSecret: storedValues.clientSecret ?? '',
    },
  });
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    setLoginEnvData(data);
    onSubmit(data);
  };

  const onRestoreDefaults = () => {
    form.reset();
    setLoginEnvData({});
    onSubmit({});
  };

  return (
    <Form {...form}>
      <FormField
        name="entityId"
        render={({ field }) => (
          <FormItem>
            <Label>Entity ID</Label>
            <Input type="text" placeholder="default entity id" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="entityUserId"
        render={({ field }) => (
          <FormItem>
            <Label>Entity User ID</Label>
            <Input
              type="text"
              placeholder="default entity user id"
              {...field}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />

      <FormField
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <Label>Client ID</Label>
            <Input type="text" placeholder="default client id" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="clientSecret"
        render={({ field }) => (
          <FormItem>
            <Label>Client Secret</Label>
            <Input type="text" placeholder="default client secret" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-4 flex flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          onClick={form.handleSubmit(handleSubmit)}
        >
          Login
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onRestoreDefaults}
        >
          Restore defaults
        </Button>
        <Button variant="ghost" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}
