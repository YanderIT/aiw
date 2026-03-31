"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronLeft, ChevronRight, Download } from "lucide-react";
import moment from "moment";

interface PolishingDocument {
  uuid: string;
  user_uuid: string;
  title?: string;
  form_data: any;
  created_at?: string;
  payment_status?: string;
  order_no?: string | null;
  paid_at?: string | null;
  paid_amount?: number | null;
}

const PAGE_SIZE = 10;

export default function PolishingOrdersClient({
  documents,
}: {
  documents: PolishingDocument[];
}) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PolishingDocument | null>(null);

  const totalPages = Math.max(1, Math.ceil(documents.length / PAGE_SIZE));
  const pagedData = documents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const fd = (doc: PolishingDocument) => doc.form_data || {};

  return (
    <>
      <div className="w-full px-4 md:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">人工润色订单</h1>
          <p className="text-muted-foreground text-sm mt-1">
            共 {documents.length} 条记录
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户姓名</TableHead>
                <TableHead>联系方式</TableHead>
                <TableHead>文书文件</TableHead>
                <TableHead>润色需求</TableHead>
                <TableHead>返回方式</TableHead>
                <TableHead>支付状态</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex w-full justify-center items-center py-8 text-muted-foreground">
                      暂无润色订单
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pagedData.map((doc: PolishingDocument) => {
                  const basic = fd(doc).basicInfo || {};
                  const details = fd(doc).polishingDetails || {};
                  return (
                    <TableRow key={doc.uuid}>
                      <TableCell>{basic.full_name || "-"}</TableCell>
                      <TableCell>
                        <div className="text-sm space-y-0.5">
                          {basic.email && <div>{basic.email}</div>}
                          {basic.wechat && <div>微信: {basic.wechat}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {details.uploaded_document_url ? (
                          <a
                            href={details.uploaded_document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline text-sm inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            {details.uploaded_document_name || "下载"}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[160px] truncate text-sm"
                          title={details.polishing_requirements || ""}
                        >
                          {details.polishing_requirements || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {details.return_method === "email" ? (
                          <Badge variant="outline">邮件</Badge>
                        ) : details.return_method === "wechat" ? (
                          <Badge variant="outline">微信</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {doc.payment_status === "paid" ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">已支付</Badge>
                        ) : doc.payment_status === "created" ? (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-300">待支付</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-400">未下单</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {moment(doc.created_at).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelected(doc)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            第 {page} / {totalPages} 页
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p: number) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              上一页
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p: number) => p + 1)}
            >
              下一页
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* 详情弹窗 */}
      <Dialog
        open={!!selected}
        onOpenChange={(open: boolean) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>润色订单详情</DialogTitle>
          </DialogHeader>
          {selected && <OrderDetail doc={selected} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function OrderDetail({ doc }: { doc: PolishingDocument }) {
  const basic = doc.form_data?.basicInfo || {};
  const details = doc.form_data?.polishingDetails || {};
  const academic = doc.form_data?.academicBackground || {};
  const target = doc.form_data?.targetProgram || {};
  const background = doc.form_data?.backgroundExperience || {};
  const needs = doc.form_data?.consultationNeeds || {};

  return (
    <div className="space-y-6">
      <Section title="基本信息">
        <Row label="姓名" value={basic.full_name} />
        <Row label="邮箱" value={basic.email} />
        <Row label="手机" value={basic.phone} />
        <Row label="微信" value={basic.wechat} />
      </Section>

      <Section title="润色详情">
        <Row label="润色需求" value={details.polishing_requirements} />
        <Row
          label="上传文件"
          value={
            details.uploaded_document_url ? (
              <a
                href={details.uploaded_document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline inline-flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                {details.uploaded_document_name || "下载文件"}
              </a>
            ) : (
              "-"
            )
          }
        />
        <Row
          label="返回方式"
          value={
            details.return_method === "email"
              ? `邮件: ${details.return_email || "-"}`
              : details.return_method === "wechat"
              ? `微信: ${details.return_wechat || "-"}`
              : "-"
          }
        />
      </Section>

      {(academic.current_school || academic.major) && (
        <Section title="学术背景">
          <Row label="当前学校" value={academic.current_school} />
          <Row label="专业" value={academic.major} />
          <Row label="学历" value={academic.degree} />
          <Row label="GPA" value={academic.gpa} />
          <Row label="预计毕业" value={academic.graduation_date} />
        </Section>
      )}

      {(target.target_school || target.target_program) && (
        <Section title="目标院校">
          <Row label="目标学校" value={target.target_school} />
          <Row label="目标专业" value={target.target_program} />
          <Row label="学位类型" value={target.degree_type} />
          <Row label="申请入学时间" value={target.application_year} />
        </Section>
      )}

      {(background.research_experience || background.work_experience) && (
        <Section title="背景经历">
          <Row label="科研经历" value={background.research_experience} />
          <Row label="工作/实习经历" value={background.work_experience} />
          <Row label="课外活动" value={background.extracurricular} />
          <Row label="获奖情况" value={background.awards} />
        </Section>
      )}

      {(needs.consultation_type || needs.additional_notes) && (
        <Section title="咨询需求">
          <Row label="咨询类型" value={needs.consultation_type} />
          <Row label="补充说明" value={needs.additional_notes} />
        </Section>
      )}

      <Section title="支付信息">
        <Row
          label="支付状态"
          value={
            doc.payment_status === "paid" ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">已支付</Badge>
            ) : doc.payment_status === "created" ? (
              <Badge variant="outline" className="text-yellow-600 border-yellow-300">待支付</Badge>
            ) : (
              <Badge variant="outline" className="text-gray-400">未下单</Badge>
            )
          }
        />
        {doc.order_no && <Row label="订单号" value={doc.order_no} />}
        {doc.paid_at && (
          <Row label="支付时间" value={moment(doc.paid_at).format("YYYY-MM-DD HH:mm:ss")} />
        )}
        {doc.paid_amount != null && (
          <Row label="支付金额" value={`¥${(doc.paid_amount / 100).toFixed(2)}`} />
        )}
      </Section>

      <div className="text-xs text-muted-foreground pt-2 border-t">
        提交时间: {moment(doc.created_at).format("YYYY-MM-DD HH:mm:ss")} | 文档ID: {doc.uuid}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-foreground">{title}</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="col-span-2 sm:col-span-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-sm mt-0.5">{value}</div>
    </div>
  );
}
