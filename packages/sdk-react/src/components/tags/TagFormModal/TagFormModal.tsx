import { getTagCategoryLabel, tagCategories, type TagCategory } from '../helpers';
import { useTags } from '../useTags';
import { components } from '@/api';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { Button } from '@/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import { Input } from '@/ui/components/input';
import { InputTags } from '@/ui/components/input-tags';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from '@/ui/components/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/ui/components/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

const getValidationSchema = (i18n: I18n) =>
  z.object({
    name: z
      .string()
      .min(1, t(i18n)`Required`)
      .max(255, t(i18n)`Value must be at most '255' characters`),
    category: z.union([z.literal(''), z.enum(tagCategories)]),
    keywords: z.array(
      z
        .string()
        .min(2, t(i18n)`Keyword should be at least 2 characters long`)
        .max(25, t(i18n)`Keyword should be at most 25 characters long`)
    ),
  });

interface ITag {
  id: string;
  name: string;
  category?: components['schemas']['TagCategory'];
  keywords?: string[] | string;
}

interface TagFormModalProps {
  tag?: ITag;
  onCreate?: (tag: components['schemas']['TagReadSchema']) => void;
  onUpdate?: (tag: components['schemas']['TagReadSchema']) => void;
  onClose?: () => void;
  onDelete?: (tag: components['schemas']['TagReadSchema']) => void;

  isDeleteAllowed: boolean;

  /** Whether the modal is open or not */
  open: boolean;
}

type FormFields = {
  name: string;
  category: TagCategory | '';
  keywords: components['schemas']['OcrAutoTaggingSettingsRequest']['keywords'];
};

/**
 * `TagFormModal` is responsible for creating or updating
 *   the tag.
 *  If no `tag` provided then the form is working on `creating` mode
 *  If `tag` provided then the form is working on `updating` mode
 */
export const TagFormModal = (props: TagFormModalProps) => (
  <MoniteScopedProviders>
    <TagFormModalBase {...props} />
  </MoniteScopedProviders>
);

const TagFormModalBase = ({
  tag,
  onCreate,
  onUpdate,
  onDelete,
  onClose,
  open,
  isDeleteAllowed,
}: TagFormModalProps) => {
  const { i18n } = useLingui();
  const schema = getValidationSchema(i18n);

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      category: '',
      keywords: [],
    },
  });

  const { control, handleSubmit, reset, setError } = form;

  useEffect(() => {
    let keywords: string[] = [];

    if (tag?.keywords) {
      if (Array.isArray(tag.keywords)) {
        keywords = tag.keywords;
      } else if (typeof tag.keywords === 'string') {
        keywords = (tag.keywords as string)
          .split(',')
          .map((keyword: string) => keyword.trim())
          .filter(Boolean);
      }
    }

    reset({
      name: tag?.name || '',
      category: tag?.category || '',
      keywords,
    });
  }, [reset, tag]);

  const { createTag, updateTag, inProgress, updateOcrAutoTagging } = useTags({
    setNameError: (errorMessage) => {
      setError('name', { type: 'custom', message: errorMessage });
    },
    onTagCreated: (createdTag) => {
      toast.success(t(i18n)`New tag “${createdTag.name}” created`);
      onCreate?.(createdTag);
      onClose?.();
      reset();
    },
    onTagUpdated: (updatedTag) => {
      if (tag) {
        toast.success(
          tag.name !== updatedTag.name
            ? t(i18n)`Tag “${tag.name}” renamed to “${updatedTag.name}”`
            : t(i18n)`Tag “${tag.name}” was updated”`
        );
      }
      onUpdate?.(updatedTag);
      onClose?.();
      reset();
    },
  });

  const { root } = useRootElements();

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-tag-${useId()}`;

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent container={root} className="mtw:w-[600px]">
          <SheetHeader>
            <SheetTitle>
              {tag ? t(i18n)`Edit tag ”${tag.name}”` : t(i18n)`Create new tag`}
            </SheetTitle>
            <SheetDescription className="mtw:sr-only">
              {tag ? t(i18n)`Edit tag ”${tag.name}”` : t(i18n)`Create new tag`}
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              id={formName}
              name={formName}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(async (values) => {
                  const { keywords, name, category } = values;
                  const payload = {
                    name,
                    ...(category ? { category: category as TagCategory } : {}),
                  };

                  const result = await (tag
                    ? updateTag(tag.id, payload)
                    : createTag(payload));

                  updateOcrAutoTagging(result.id, keywords);
                })(e);
              }}
            >
              <div className="mtw:flex mtw:flex-col mtw:gap-4 mtw:px-6 mtw:pt-8 mtw:pb-6">
                <FormField
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(i18n)`Name`}</FormLabel>
                      <FormControl>
                        <Input autoFocus {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(i18n)`Category`}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="mtw:w-full">
                            <SelectValue placeholder={t(i18n)`Not set`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tagCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {getTagCategoryLabel(category, i18n)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="keywords"
                  control={control}
                  render={({ field }) => (
                  <FormItem className="mtw:flex mtw:flex-col">
                      <FormLabel>{t(i18n)`Keywords`}</FormLabel>

                      <InputTags {...field} value={field.value ?? []} />

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <SheetFooter className="mtw:flex mtw:flex-row mtw:justify-end mtw:gap-2">
            {tag && (
              <Button
                className="mtw:mr-auto"
                variant="destructive"
                size="lg"
                onClick={() => {
                  onDelete?.(tag as components['schemas']['TagReadSchema']);
                  onClose?.();
                }}
                disabled={!isDeleteAllowed}
              >
                {t(i18n)`Delete`}
              </Button>
            )}
            <Button variant="ghost" size="lg" onClick={onClose}>
              {t(i18n)`Cancel`}
            </Button>
            <Button
              type="submit"
              form={formName}
              size="lg"
              disabled={inProgress}
            >
              {tag ? t(i18n)`Save` : t(i18n)`Create`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
