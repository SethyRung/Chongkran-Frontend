<template>
  <UCard
    variant="outline"
    :ui="{
      header: 'py-1.5',
    }"
  >
    <template #header>
      <div class="w-fit mx-auto flex gap-1 items-center flex-wrap">
        <UButton
          icon="i-lucide-corner-up-left"
          variant="ghost"
          :color="
            tiptapEditor?.can().chain().focus().undo().run()
              ? 'primary'
              : 'neutral'
          "
          @click="tiptapEditor?.chain().focus().undo().run()"
        />
        <UButton
          icon="i-lucide-corner-up-right"
          variant="ghost"
          :color="
            tiptapEditor?.can().chain().focus().redo().run()
              ? 'primary'
              : 'neutral'
          "
          @click="tiptapEditor?.chain().focus().redo().run()"
        />
        <USeparator orientation="vertical" class="h-6" />
        <UPopover>
          <UButton
            :icon="getTypography()"
            variant="soft"
            color="neutral"
            trailing-icon="i-lucide-chevron-down"
            :ui="{
              base: 'text-primary-500',
              trailingIcon: 'size-3',
            }"
          />

          <template #content>
            <div class="w-max flex flex-col bg-white">
              <UButton
                v-for="level in HeadingList"
                :key="level"
                variant="ghost"
                :color="
                  getTypography() === `i-lucide-heading-${level}`
                    ? 'primary'
                    : 'neutral'
                "
                :icon="`i-lucide-heading-${level}`"
                @click="changeTypography(level)"
              >
                Heading {{ level }}
              </UButton>
            </div>
          </template>
        </UPopover>
        <UPopover>
          <UButton
            icon="i-lucide-list"
            variant="ghost"
            :color="getSelectedList() ? 'primary' : 'neutral'"
          />

          <template #content>
            <div class="w-max flex flex-col bg-white">
              <UButton
                icon="i-lucide-list"
                label="Bullet List"
                variant="ghost"
                :color="
                  getSelectedList() === 'bulletList' ? 'primary' : 'neutral'
                "
                @click="tiptapEditor?.chain().focus().toggleBulletList().run()"
              />
              <UButton
                icon="i-lucide-list-ordered"
                label="Ordered List"
                variant="ghost"
                :color="
                  getSelectedList() === 'orderedList' ? 'primary' : 'neutral'
                "
                @click="tiptapEditor?.chain().focus().toggleOrderedList().run()"
              />
              <UButton
                icon="i-lucide-list-collapse"
                label="Task List"
                variant="ghost"
                :color="
                  getSelectedList() === 'orderedList' ? 'primary' : 'neutral'
                "
                @click="tiptapEditor?.chain().focus().toggleOrderedList().run()"
              />
            </div>
          </template>
        </UPopover>
        <UButton
          icon="i-lucide-message-square-quote"
          variant="ghost"
          :color="tiptapEditor?.isActive('blockquote') ? 'primary' : 'neutral'"
          @click="tiptapEditor?.chain().focus().toggleBlockquote().run()"
        />
        <UButton
          icon="i-lucide-square-code"
          variant="ghost"
          :color="tiptapEditor?.isActive('codeBlock') ? 'primary' : 'neutral'"
          @click="tiptapEditor?.chain().focus().toggleCodeBlock().run()"
        />
        <USeparator orientation="vertical" class="h-6" />
        <UButton
          icon="i-material-symbols-format-bold"
          variant="ghost"
          :color="tiptapEditor?.isActive('bold') ? 'primary' : 'neutral'"
          @click="tiptapEditor?.chain().focus().toggleBold().run()"
        />
        <UButton
          icon="i-material-symbols-format-italic"
          variant="ghost"
          :color="tiptapEditor?.isActive('italic') ? 'primary' : 'neutral'"
          @click="tiptapEditor?.chain().focus().toggleItalic().run()"
        />
        <UButton
          icon="i-material-symbols-format-underlined"
          variant="ghost"
          :color="tiptapEditor?.isActive('underline') ? 'primary' : 'neutral'"
          @click="tiptapEditor?.chain().focus().toggleUnderline().run()"
        />
        <UButton
          icon="i-material-symbols-format-strikethrough-rounded"
          variant="ghost"
          :color="tiptapEditor?.isActive('strike') ? 'primary' : 'neutral'"
          @click="tiptapEditor?.chain().focus().toggleStrike().run()"
        />
        <UButton
          icon="i-lucide-code-xml"
          variant="ghost"
          :color="tiptapEditor?.isActive('code') ? 'primary' : 'neutral'"
          @click="tiptapEditor?.chain().focus().toggleCode().run()"
        />
        <UButton
          icon="i-lucide-brush"
          variant="ghost"
          :color="tiptapEditor?.isActive('highlight') ? 'primary' : 'neutral'"
          @click="tiptapEditor?.chain().focus().toggleHighlight().run()"
        />
        <UPopover
          @update:open="
            (value) => {
              if (value) getLink();
            }
          "
        >
          <UButton
            icon="i-lucide-link"
            variant="ghost"
            :color="tiptapEditor?.isActive('link') ? 'primary' : 'neutral'"
          />
          <template #content>
            <UButtonGroup>
              <UInput
                v-model="link"
                placeholder="Paste a link"
                :ui="{
                  base: 'w-56 focus-visible:ring focus-visible:ring-accented',
                }"
              />
              <UTooltip text="Apply link">
                <UButton
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-corner-down-left"
                  @click="setLink"
                />
              </UTooltip>
              <UTooltip text="Open in new window">
                <UButton
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-square-arrow-out-up-right"
                  :to="link"
                />
              </UTooltip>
              <UTooltip text="Remove link">
                <UButton
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-trash"
                  @click="removeLink"
                />
              </UTooltip>
            </UButtonGroup>
          </template>
        </UPopover>
        <UButton
          icon="i-lucide-separator-horizontal"
          variant="ghost"
          color="neutral"
          @click="tiptapEditor?.chain().focus().setHorizontalRule().run()"
        />
        <UButton
          icon="i-lucide-wrap-text"
          variant="ghost"
          color="neutral"
          @click="tiptapEditor?.chain().focus().setHardBreak().run()"
        />
        <USeparator orientation="vertical" class="h-6" />
        <UButton
          icon="i-lucide-superscript"
          variant="ghost"
          :color="tiptapEditor?.isActive('superscript') ? 'primary' : 'neutral'"
          @click="tiptapEditor?.chain().focus().toggleSuperscript().run()"
        />
        <UButton
          icon="i-lucide-subscript"
          variant="ghost"
          :color="tiptapEditor?.isActive('subscript') ? 'primary' : 'neutral'"
          @click="tiptapEditor?.chain().focus().toggleSubscript().run()"
        />
        <USeparator orientation="vertical" class="h-6" />
        <UButton
          v-for="align in TextAlignList"
          :key="align"
          :icon="`i-lucide-align-${align}`"
          variant="ghost"
          :color="
            tiptapEditor?.isActive({ textAlign: align }) ? 'primary' : 'neutral'
          "
          @click="tiptapEditor?.chain().focus().setTextAlign(align).run()"
        />
        <USeparator orientation="vertical" class="h-6" />
        <UButton
          icon="i-lucide-image"
          variant="ghost"
          :color="tiptapEditor?.isActive('image') ? 'primary' : 'neutral'"
        />
      </div>
    </template>
    <ClientOnly>
      <EditorContent :editor="tiptapEditor" class="content" />
      <template #fallback>
        <USkeleton class="w-full h-80" />
      </template>
    </ClientOnly>
  </UCard>
</template>
<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { StarterKit as TiptapStarterKit } from "@tiptap/starter-kit";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { TaskItem as TiptapTaskItem } from "@tiptap/extension-task-item";
import { TaskList as TiptapTaskList } from "@tiptap/extension-task-list";
import { TextAlign as TiptapTextAlign } from "@tiptap/extension-text-align";
import { Typography as TiptapTypography } from "@tiptap/extension-typography";
import { Highlight as TiptapHighlight } from "@tiptap/extension-highlight";
import { Subscript as TiptapSubscript } from "@tiptap/extension-subscript";
import { Superscript as TiptapSuperscript } from "@tiptap/extension-superscript";
import { Underline as TiptapUnderline } from "@tiptap/extension-underline";

type Level = 1 | 2 | 3 | 4 | 5 | 6;

type TextAlign = "left" | "center" | "right" | "justify";

const HeadingList: Array<Level> = [1, 2, 3, 4, 5, 6];
const TextAlignList: Array<TextAlign> = ["left", "center", "right", "justify"];

const modelValue = defineModel<string>();

const tiptapEditor = useEditor({
  content: modelValue.value ?? "",
  editorProps: {
    attributes: {
      autocomplete: "off",
      autocorrect: "off",
      autocapitalize: "off",
    },
  },
  extensions: [
    TiptapStarterKit,
    TiptapImage,
    TiptapTaskItem.configure({ nested: true }),
    TiptapTaskList,
    TiptapTextAlign.configure({ types: ["heading", "paragraph"] }),
    TiptapTypography,
    TiptapHighlight.configure({ multicolor: true }),
    TiptapSubscript,
    TiptapSuperscript,
    TiptapUnderline,
  ],
  onBlur({ editor }) {
    modelValue.value = editor.getHTML();
  },
});

const getTypography = (): string => {
  if (!tiptapEditor.value) return "i-material-symbols-personal-places-outline";
  for (let i = 1; i <= 6; i++) {
    if (tiptapEditor.value.isActive("heading", { level: i })) {
      return `i-lucide-heading-${i}`;
    }
  }
  return "i-material-symbols-personal-places-outline";
};

const changeTypography = (level: Level) => {
  if (tiptapEditor.value?.isActive("heading", { level })) {
    tiptapEditor.value?.chain().focus().setParagraph().run();
  } else {
    tiptapEditor.value?.chain().focus().setHeading({ level }).run();
  }
};

const getSelectedList = () => {
  if (tiptapEditor.value?.isActive("bulletList")) return "bulletList";
  if (tiptapEditor.value?.isActive("orderedList")) return "orderedList";
  if (tiptapEditor.value?.isActive("taskList")) return "taskList";
};

const link = ref<string>();
const setLink = () => {
  tiptapEditor.value
    ?.chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: link.value ?? "" })
    .run();
};

const removeLink = () => {
  tiptapEditor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
};

const getLink = () => {
  link.value = tiptapEditor.value?.getAttributes("link").href;
};
</script>
<style scoped>
::v-deep(.ProseMirror:focus) {
  outline: none;
}
</style>
