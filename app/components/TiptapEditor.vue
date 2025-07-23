<template>
  <div>
    <!-- <div v-if="tiptapEditor">
      <button @click="tiptapEditor.chain().focus().unsetAllMarks().run()">
        clear marks
      </button>
      <button @click="tiptapEditor.chain().focus().clearNodes().run()">
        clear nodes
      </button>
      <button @click="tiptapEditor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </button>
      <button @click="tiptapEditor.chain().focus().setHardBreak().run()">
        hard break
      </button>
    </div> -->
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
              :icon="getTypography(tiptapEditor)"
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
                    getTypography(tiptapEditor) === `i-lucide-heading-${level}`
                      ? 'primary'
                      : 'neutral'
                  "
                  :icon="`i-lucide-heading-${level}`"
                  @click="changeTypography(tiptapEditor, level)"
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
              :color="getSelectedList(tiptapEditor) ? 'primary' : 'neutral'"
            />

            <template #content>
              <div class="w-max flex flex-col bg-white">
                <UButton
                  icon="i-lucide-list"
                  label="Bullet List"
                  variant="ghost"
                  :color="
                    getSelectedList(tiptapEditor) === 'bulletList'
                      ? 'primary'
                      : 'neutral'
                  "
                  @click="
                    tiptapEditor?.chain().focus().toggleBulletList().run()
                  "
                />
                <UButton
                  icon="i-lucide-list-ordered"
                  label="Ordered List"
                  variant="ghost"
                  :color="
                    getSelectedList(tiptapEditor) === 'orderedList'
                      ? 'primary'
                      : 'neutral'
                  "
                  @click="
                    tiptapEditor?.chain().focus().toggleOrderedList().run()
                  "
                />
                <UButton
                  icon="i-lucide-list-collapse"
                  label="Task List"
                  variant="ghost"
                  :color="
                    getSelectedList(tiptapEditor) === 'orderedList'
                      ? 'primary'
                      : 'neutral'
                  "
                  @click="
                    tiptapEditor?.chain().focus().toggleOrderedList().run()
                  "
                />
              </div>
            </template>
          </UPopover>
          <UButton
            icon="i-lucide-message-square-quote"
            variant="ghost"
            :color="
              tiptapEditor?.isActive('blockquote') ? 'primary' : 'neutral'
            "
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
          <UPopover>
            <UButton
              icon="i-lucide-link"
              variant="ghost"
              :color="tiptapEditor?.isActive('link') ? 'primary' : 'neutral'"
            />
            <template #content>
              <UButtonGroup>
                <UInput
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
                  />
                </UTooltip>
                <UTooltip text="Open in new window">
                  <UButton
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-square-arrow-out-up-right"
                  />
                </UTooltip>
                <UTooltip text="Remove link">
                  <UButton
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-trash"
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
            :color="
              tiptapEditor?.isActive('superscript') ? 'primary' : 'neutral'
            "
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
              tiptapEditor?.isActive({ textAlign: align })
                ? 'primary'
                : 'neutral'
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
  </div>
</template>
<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
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

const content = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        textAlign: null,
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "Getting started",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
      },
      content: [
        {
          type: "text",
          text: "Welcome to the ",
        },
        {
          type: "text",
          marks: [
            {
              type: "italic",
            },
            {
              type: "highlight",
              attrs: {
                color: "var(--tt-color-highlight-yellow)",
              },
            },
          ],
          text: "Simple Editor",
        },
        {
          type: "text",
          text: " template! This template integrates ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "open source",
        },
        {
          type: "text",
          text: " UI components and Tiptap extensions licensed under ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "MIT",
        },
        {
          type: "text",
          text: ".",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
      },
      content: [
        {
          type: "text",
          text: "Integrate it by following the ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tiptap.dev/docs/ui-components/templates/simple-editor",
                target: "_blank",
                rel: "noopener noreferrer nofollow",
                class: null,
              },
            },
          ],
          text: "Tiptap UI Components docs",
        },
        {
          type: "text",
          text: " or using our CLI tool.",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: {
        language: null,
      },
      content: [
        {
          type: "text",
          text: "npx @tiptap/cli init",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Features",
        },
      ],
    },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              type: "text",
              marks: [
                {
                  type: "italic",
                },
              ],
              text: "A fully responsive rich text editor with built-in support for common formatting and layout tools. Type markdown ",
            },
            {
              type: "text",
              marks: [
                {
                  type: "code",
                },
              ],
              text: "**",
            },
            {
              type: "text",
              marks: [
                {
                  type: "italic",
                },
              ],
              text: " or use keyboard shortcuts ",
            },
            {
              type: "text",
              marks: [
                {
                  type: "code",
                },
              ],
              text: "⌘+B",
            },
            {
              type: "text",
              text: " for ",
            },
            {
              type: "text",
              marks: [
                {
                  type: "strike",
                },
              ],
              text: "most",
            },
            {
              type: "text",
              text: " all common markdown marks. 🪄",
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Add images, customize alignment, and apply ",
        },
        {
          type: "text",
          marks: [
            {
              type: "highlight",
              attrs: {
                color: "var(--tt-color-highlight-blue)",
              },
            },
          ],
          text: "advanced formatting",
        },
        {
          type: "text",
          text: " to make your writing more engaging and professional.",
        },
      ],
    },
    {
      type: "image",
      attrs: {
        src: "https://template.tiptap.dev/images/placeholder-image.png",
        alt: "placeholder-image",
        title: "placeholder-image",
      },
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "Superscript",
                },
                {
                  type: "text",
                  text: " (x",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "superscript",
                    },
                  ],
                  text: "2",
                },
                {
                  type: "text",
                  text: ") and ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "Subscript",
                },
                {
                  type: "text",
                  text: " (H",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "subscript",
                    },
                  ],
                  text: "2",
                },
                {
                  type: "text",
                  text: "O) for precision.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "Typographic conversion",
                },
                {
                  type: "text",
                  text: ": automatically convert to ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "code",
                    },
                  ],
                  text: "->",
                },
                {
                  type: "text",
                  text: " an arrow ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "→",
                },
                {
                  type: "text",
                  text: ".",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          marks: [
            {
              type: "italic",
            },
          ],
          text: "→ ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tiptap.dev/docs/ui-components/templates/simple-editor#features",
                target: "_blank",
                rel: "noopener noreferrer nofollow",
                class: null,
              },
            },
          ],
          text: "Learn more",
        },
      ],
    },
    {
      type: "horizontalRule",
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Make it your own",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Switch between light and dark modes, and tailor the editor's appearance with customizable CSS to match your style.",
        },
      ],
    },
    {
      type: "taskList",
      content: [
        {
          type: "taskItem",
          attrs: {
            checked: true,
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Test template",
                },
              ],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: {
            checked: false,
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "link",
                      attrs: {
                        href: "https://tiptap.dev/docs/ui-components/templates/simple-editor",
                        target: "_blank",
                        rel: "noopener noreferrer nofollow",
                        class: null,
                      },
                    },
                  ],
                  text: "Integrate the free template",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
    },
  ],
};

const tiptapEditor = useEditor({
  editorProps: {
    attributes: {
      autocomplete: "off",
      autocorrect: "off",
      autocapitalize: "off",
      "aria-label": "Main content area, start typing to enter text.",
    },
  },
  content: content,
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
});

const getTypography = (editor: Editor | undefined): string => {
  if (!editor) return "i-material-symbols-personal-places-outline";
  for (let i = 1; i <= 6; i++) {
    if (editor.isActive("heading", { level: i })) {
      return `i-lucide-heading-${i}`;
    }
  }
  return "i-material-symbols-personal-places-outline";
};

const changeTypography = (editor: Editor | undefined, level: Level) => {
  if (editor?.isActive("heading", { level })) {
    editor?.chain().focus().setParagraph().run();
  } else {
    editor?.chain().focus().setHeading({ level }).run();
  }
};

const getSelectedList = (editor: Editor | undefined) => {
  if (editor?.isActive("bulletList")) return "bulletList";
  if (editor?.isActive("orderedList")) return "orderedList";
  if (editor?.isActive("taskList")) return "taskList";
};
</script>
<style scoped>
::v-deep(.ProseMirror:focus) {
  outline: none;
}
</style>
