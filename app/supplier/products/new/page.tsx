
"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Category = {
  id: string;
  name: string;
  sort_order: number | null;
};

type ImageGroup = {
  key: string;
  title: string;
  description: string;
  min: number;
  max: number;
  files: File[];
};

const initialGroups: ImageGroup[] = [
  {
    key: "main",
    title: "一、主图",
    description: "白底或浅背景，1 张",
    min: 1,
    max: 1,
    files: [],
  },
  {
    key: "scene",
    title: "二、场景图",
    description: "至少 1 张",
    min: 1,
    max: 20,
    files: [],
  },
  {
    key: "dimension",
    title: "三、尺寸图",
    description: "1–2 张",
    min: 1,
    max: 2,
    files: [],
  },
  {
    key: "detail",
    title: "四、材质细节图",
    description: "1–2 张",
    min: 1,
    max: 2,
    files: [],
  },
];

export default function SupplierProductSubmissionPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState("");

  const [groups, setGroups] = useState<ImageGroup[]>(initialGroups);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, current) => setSession(current)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, sort_order")
        .order("sort_order", { ascending: true });

      if (error) {
        setCategoryError("分类加载失败，请刷新页面或联系管理员。");
        return;
      }

      setCategories(data ?? []);
    }

    void loadCategories();
  }, []);

  function selectImages(key: string, fileList: FileList | null) {
    const selected = Array.from(fileList ?? []);
    setGroups((current) =>
      current.map((group) =>
        group.key === key
          ? { ...group, files: [...group.files, ...selected].slice(0, group.max) }
          : group
      )
    );
    setMessage("");
  }

  function removeImage(key: string, index: number) {
    setGroups((current) =>
      current.map((group) =>
        group.key === key
          ? { ...group, files: group.files.filter((_, i) => i !== index) }
          : group
      )
    );
  }

  async function validateImage(file: File): Promise<string | null> {
    if (!file.type.startsWith("image/")) {
      return `${file.name} 不是有效的图片文件。`;
    }

    if (file.size > 12 * 1024 * 1024) {
      return `${file.name} 超过单张 12 MB 的大小限制。`;
    }

    try {
      const bitmap = await createImageBitmap(file);
      const valid = bitmap.width >= 2000 || bitmap.height >= 2000;
      const dimensions = `${bitmap.width} × ${bitmap.height}`;
      bitmap.close();

      if (!valid) {
        return `${file.name} 的分辨率为 ${dimensions}，至少一个边长须达到 2000px。`;
      }
    } catch {
      return `无法读取 ${file.name} 的图片尺寸，请更换图片。`;
    }

    return null;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (!session) {
      setMessage("请先登录供应商账号。");
      return;
    }

    if (!sku.trim() || !name.trim() || !categoryId) {
      setMessage("请填写 SKU、产品名称并选择产品分类。");
      return;
    }

    for (const group of groups) {
      if (group.files.length < group.min || group.files.length > group.max) {
        setMessage(
          `${group.title}要求${group.description}，当前已选择 ${group.files.length} 张。`
        );
        return;
      }
    }

    setBusy(true);
    setUploading(true);
    setMessage("");

    try {
      for (const group of groups) {
        for (const file of group.files) {
          const error = await validateImage(file);
          if (error) throw new Error(error);
        }
      }

      // 按主图、场景图、尺寸图、材质细节图的顺序上传。
      // 文件名由后端根据供应商品牌和 SKU 统一处理。
      const imageUrls: string[] = [];

      for (const group of groups) {
        for (const file of group.files) {
          const form = new FormData();
          form.append("file", file);

          const response = await fetch("/api/supplier/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: form,
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || `上传失败：${file.name}`);
          }

imageUrls.push(result.url);
        }
      }

      const payload = {
        sku_code: sku.trim(),
        name: name.trim(),
        category_id: categoryId,
        description: description.trim(),
        variants: [],
      };

      const response = await fetch("/api/supplier/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          payload,
          image_urls: imageUrls,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "提交失败");
      }

      setMessage(`产品已提交审核。提交编号：${result.submission.id}`);
      setGroups(initialGroups);
      setSku("");
      setName("");
      setCategoryId("");
      setDescription("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "提交失败，请重试。");
    } finally {
      setUploading(false);
      setBusy(false);
    }
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">供应商产品提交</h1>
        <p className="mt-3">
          请先
          <a className="underline" href=" ">登录</a >
          后提交产品。
        </p >
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">供应商产品提交</h1>
        <button
          type="button"
          className="text-sm underline"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/supplier/login";
          }}
        >
          退出登录
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        请按顺序上传产品图片，再填写产品资料。提交后由管理员审核，不会自动发布。
      </p >

      <form onSubmit={submit} className="mt-6 space-y-6">
        {/* 1–4：图片上传，严格按指定顺序呈现 */}
        <section className="space-y-5">
          <h2 className="text-lg font-semibold">产品图片</h2>
          <p className="text-sm text-gray-600">
            每张图片至少 2000px，单张不超过 12 MB。原始文件名无需修改。
          </p >

          {groups.map((group) => (
            <div key={group.key} className="rounded-lg border p-4">
              <h3 className="font-medium">{group.title}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {group.description}
              </p >

              <input
                className="mt-3 block w-full text-sm"
                type="file"
                accept="image/*"
                multiple={group.max > 1}
                disabled={busy}
                onChange={(event) => {
                  selectImages(group.key, event.target.files);
                  event.target.value = "";
                }}
              />

              {group.files.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm">
                  {group.files.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="break-all">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        className="shrink-0 text-red-700 underline"
                        disabled={busy}
                        onClick={() => removeImage(group.key, index)}
                      >
                        移除
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
        {/* 5：基本信息 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">产品基本信息</h2>

          <label className="block text-sm">
            产品 SKU *
            <input
              required
              maxLength={120}
              className="mt-1 w-full rounded border p-3"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </label>

          <label className="block text-sm">
            产品名称 *
            <input
              required
              maxLength={300}
              className="mt-1 w-full rounded border p-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="block text-sm">
            产品分类 *
            <select
              required
              className="mt-1 w-full rounded border p-3"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">请选择产品分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoryError && (
              <span className="mt-1 block text-red-700">
                {categoryError}
              </span>
            )}
          </label>

          <label className="block text-sm">
            产品描述
            <textarea
              rows={4}
              className="mt-1 w-full rounded border p-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </section>

        <button
          type="submit"
          disabled={busy || uploading}
          className="rounded bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {busy ? "正在提交…" : "提交审核"}
        </button>
      </form>

      {message && (
        <p
          role="status"
          className="mt-4 break-words rounded bg-gray-100 p-3 text-sm"
        >
          {message}
        </p >
      )}
    </main>
  );
}